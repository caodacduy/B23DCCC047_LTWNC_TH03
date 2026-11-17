import { db } from '@/lib/db';
import type { LoanStatus } from '@/types';

export function getReviewQueue() {
  const counts: Record<LoanStatus, number> = { pending: 0, approved: 0, rejected: 0 };
  const pending = db.loans.filter((loan) => {
    counts[loan.status]++;
    return loan.status === 'pending';
  });
  const titles = new Map(db.books.map(({ id, title }) => [id, title]));
  return {
    counts,
    pending: pending.map((loan) => ({
      ...loan,
      bookTitle: titles.get(loan.bookId) ?? `#${loan.bookId}`,
    })),
  };
}

export function changeLoanStatus(id: number, status: 'approved' | 'rejected') {
  if (status !== 'approved' && status !== 'rejected') return false;
  const loan = db.loans.find((item) => item.id === id && item.status === 'pending');
  if (!loan) return false;
  loan.status = status;
  return true;
}
