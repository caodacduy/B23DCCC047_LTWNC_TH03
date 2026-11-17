import { beforeEach, describe, expect, it } from 'vitest';
import { generateLoans } from '@/data/books';
import type { LoanData } from './loan-validate';
import { db } from './db';
import { cancelLoan, listLoans, parseStatus, submitLoan } from './loans';

const student = { email: 'sv01@ptit.edu.vn', role: 'student' } as const;
const other = { email: 'sv02@ptit.edu.vn', role: 'student' } as const;
const admin = { email: 'admin@ptit.edu.vn', role: 'admin' } as const;
const request: LoanData = { bookId: 11, pickupDate: '2026-12-03', term: 14, quantity: 1, reason: 'Ôn tập môn học' };

describe('Nghiệp vụ mượn sách', () => {
  beforeEach(() => {
    db.loans.splice(0, db.loans.length, ...generateLoans(37));
    db.nextLoanId = 38;
  });

  it('chia 27 yêu cầu của sv01 thành 3 trang 10, 10, 7 và không lộ yêu cầu của sv02', () => {
    const pages = [1, 2, 3].map((page) => listLoans(student, undefined, page));
    expect(pages.map(({ items }) => items.length)).toEqual([10, 10, 7]);
    expect(pages[0]).toMatchObject({ total: 27, totalPages: 3 });
    expect(pages.flatMap(({ items }) => items.every((loan) => loan.userEmail === student.email))).toEqual([true, true, true]);
    expect(listLoans(other, undefined, 1).total).toBe(10);
  });

  it('thủ thư xem được đủ 37 yêu cầu và lọc được yêu cầu chờ duyệt', () => {
    expect(listLoans(admin, undefined, 1)).toMatchObject({ total: 37, totalPages: 4 });
    expect(listLoans(admin, parseStatus('pending'), 1)).toMatchObject({ total: 13, totalPages: 2 });
    expect(listLoans(student, parseStatus('pending'), 1)).toMatchObject({ total: 9, totalPages: 1 });
    expect(parseStatus('unknown')).toBeUndefined();
  });

  it('kẹp số trang vào khoảng hợp lệ và xử lý số trang sai định dạng', () => {
    expect(listLoans(student, undefined, 99).page).toBe(3);
    expect(listLoans(student, undefined, -1).page).toBe(1);
    expect(listLoans(student, undefined, Number.NaN).page).toBe(1);
  });

  it('báo hết bản cho sách 6 ngày 02/12/2026 vì đã có yêu cầu được duyệt', () => {
    expect(submitLoan(student.email, { ...request, bookId: 6, pickupDate: '2026-12-02' }))
      .toEqual({ ok: false, message: 'Sách đã hết bản vào ngày này' });
  });

  it('bỏ qua yêu cầu đã bị từ chối, giữ bản cho yêu cầu mới và giải phóng bản khi hủy', () => {
    const result = submitLoan(student.email, request);
    if (!result.ok) throw new Error(result.message);
    const id = result.loan.id;
    expect(id).toBe(38);
    expect(listLoans(student, undefined, 1).items[0]).toMatchObject({ id, status: 'pending', bookTitle: 'Thiết kế cơ sở dữ liệu' });
    expect(submitLoan(other.email, request).ok).toBe(false);
    expect(cancelLoan(other.email, id)).toBe('forbidden');
    expect(cancelLoan(student.email, id)).toBe('ok');
    expect(cancelLoan(student.email, id)).toBe('not-found');
    expect(submitLoan(other.email, request).ok).toBe(true);
  });

  it('không hủy yêu cầu đã được duyệt', () => {
    expect(cancelLoan(student.email, 2)).toBe('not-pending');
  });
});
