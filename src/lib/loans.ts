import { db } from '@/lib/db';
import { can } from '@/lib/permissions';
import type { LoanData } from '@/lib/loan-validate';
import type { Loan, LoanStatus, Role } from '@/types';

const PAGE_SIZE = 10;

interface Viewer {
  email: string;
  role: Role;
}

export function parseStatus(value: string | undefined): LoanStatus | undefined {
  return value === 'pending' || value === 'approved' || value === 'rejected' ? value : undefined;
}

export function listLoans(viewer: Viewer, status: LoanStatus | undefined, page: number) {
  const viewAll = can(viewer.role, 'loan:view-all');
  const viewOwn = can(viewer.role, 'loan:view-own');
  const matching = db.loans.filter(
    (loan) => (viewAll || (viewOwn && loan.userEmail === viewer.email)) && (!status || loan.status === status),
  );
  const total = matching.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(totalPages, Math.max(1, Number.isFinite(page) ? Math.trunc(page) : 1));
  const start = (currentPage - 1) * PAGE_SIZE;
  const titles = new Map(db.books.map(({ id, title }) => [id, title]));
  const items = matching.slice(start, start + PAGE_SIZE).map((loan) => ({
    ...loan,
    bookTitle: titles.get(loan.bookId) ?? `#${loan.bookId}`,
  }));
  return { items, total, page: currentPage, totalPages };
}

type SubmitResult = { ok: true; loan: Loan } | { ok: false; message: string };

export function submitLoan(email: string, data: LoanData): SubmitResult {
  const book = db.books.find(({ id }) => id === data.bookId);
  if (!book) return { ok: false, message: 'Hãy chọn sách' };

  const reserved = db.loans.reduce(
    (total, loan) =>
      loan.bookId === data.bookId && loan.pickupDate === data.pickupDate && loan.status !== 'rejected'
        ? total + loan.quantity
        : total,
    0,
  );
  if (reserved + data.quantity > book.copies) {
    return { ok: false, message: 'Sách đã hết bản vào ngày này' };
  }

  // Kiểm tra và ghi đồng bộ để hai yêu cầu không thể cùng lấy bản cuối.
  const loan: Loan = { ...data, id: db.nextLoanId++, userEmail: email, status: 'pending' };
  db.loans.unshift(loan);
  return { ok: true, loan };
}

export function cancelLoan(email: string, id: number): 'not-found' | 'forbidden' | 'not-pending' | 'ok' {
  const index = db.loans.findIndex((loan) => loan.id === id);
  if (index < 0) return 'not-found';

  const loan = db.loans[index];
  if (loan.userEmail !== email) return 'forbidden';
  if (loan.status !== 'pending') return 'not-pending';

  db.loans.splice(index, 1);
  return 'ok';
}
