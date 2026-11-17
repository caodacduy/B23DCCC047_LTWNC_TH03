import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { generateBooks } from '@/data/books';
import { today, toLoanData, toLoanInput, validateLoan } from './loan-validate';
import type { LoanInput } from './loan-validate';

const books = generateBooks(24);
const valid: LoanInput = {
  bookId: '1', pickupDate: '2026-12-02', term: '14', quantity: '1', reason: '  Mượn để ôn tập  ',
};

describe('Kiểm tra yêu cầu mượn', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-12-01T18:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  it('chấp nhận dữ liệu hợp lệ và ngày lấy chính là hôm nay theo giờ Việt Nam', () => {
    expect(today()).toBe('2026-12-02');
    expect(validateLoan(valid, books)).toEqual({});
  });

  it('báo đầy đủ lỗi khi form trống', () => {
    expect(validateLoan(toLoanInput(new FormData()), books)).toEqual({
      bookId: 'Hãy chọn sách',
      pickupDate: 'Hãy chọn ngày',
      term: 'Hãy chọn thời hạn',
      quantity: 'Số quyển phải từ 1 trở lên',
      reason: 'Lý do tối thiểu 10 ký tự',
    });
  });

  it('từ chối ngày lấy trong quá khứ', () => {
    expect(validateLoan({ ...valid, pickupDate: '2026-12-01' }, books).pickupDate)
      .toBe('Ngày lấy sách không được ở quá khứ');
  });

  it.each(['2027-02-30', '12/02/2026', '2027-99-99'])('từ chối ngày không hợp lệ: %s', (pickupDate) => {
    expect(validateLoan({ ...valid, pickupDate }, books).pickupDate).toBe('Hãy chọn ngày');
  });

  it.each(['Ôn tập', '             '])('từ chối lý do ngắn sau khi bỏ khoảng trắng: "%s"', (reason) => {
    expect(validateLoan({ ...valid, reason }, books).reason).toBe('Lý do tối thiểu 10 ký tự');
  });

  it('báo lỗi khi mượn 2 quyển của sách chỉ có 1 bản', () => {
    expect(validateLoan({ ...valid, quantity: '2' }, books).quantity).toBe('Vượt số bản của sách (1 bản)');
  });

  it.each(['0', '-1', '1.5', 'một'])('từ chối số quyển không phải số nguyên dương: %s', (quantity) => {
    expect(validateLoan({ ...valid, quantity }, books).quantity).toBe('Số quyển phải từ 1 trở lên');
  });

  it('từ chối thời hạn 10 ngày và sách không tồn tại', () => {
    expect(validateLoan({ ...valid, term: '10', bookId: '999' }, books)).toEqual({
      bookId: 'Hãy chọn sách', term: 'Hãy chọn thời hạn',
    });
  });

  it('đổi các trường số từ chuỗi và cắt khoảng trắng ở lý do', () => {
    expect(toLoanData(valid)).toEqual({
      bookId: 1, pickupDate: '2026-12-02', term: 14, quantity: 1, reason: 'Mượn để ôn tập',
    });
  });

  it('đọc chuỗi trong FormData và bỏ trường không phải chuỗi', () => {
    const form = new FormData();
    form.set('bookId', '6');
    form.set('reason', new File(['x'], 'x.txt'));
    expect(toLoanInput(form)).toEqual({ bookId: '6', pickupDate: '', term: '', quantity: '', reason: '' });
    expect(toLoanInput({ quantity: 2, term: '14' })).toMatchObject({ quantity: '', term: '14' });
  });
});
