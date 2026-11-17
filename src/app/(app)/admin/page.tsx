import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { formatDate, TERM_LABEL } from '@/lib/format';
import { getReviewQueue } from '@/lib/review';
import { reviewLoan } from './actions';

export const metadata: Metadata = { title: 'Quản trị', robots: { index: false } };

export default async function AdminPage() {
  const session = await auth();
  if (!can(session?.user.role, 'loan:view-all')) redirect('/forbidden');
  const { counts, pending } = getReviewQueue();

  return (
    <>
      <div className="page-heading">
        <h1>Duyệt yêu cầu mượn</h1>
        <p>Xem và xử lý các yêu cầu đang chờ duyệt.</p>
      </div>
      <p className="panel summary">Chờ duyệt: {counts.pending} | Đã duyệt: {counts.approved} | Từ chối: {counts.rejected}</p>
      {pending.length === 0 ? <p className="panel empty">Không có yêu cầu chờ duyệt.</p> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Sách</th><th scope="col">Ngày lấy</th><th scope="col">Thời hạn</th><th scope="col">Số quyển</th><th scope="col">Người mượn</th><th scope="col">Xử lý</th></tr></thead>
            <tbody>
              {pending.map((loan) => (
                <tr key={loan.id}>
                  <td><Link className="text-link" href={`/books/${loan.bookId}`}>{loan.bookTitle}</Link></td>
                  <td><time dateTime={loan.pickupDate}>{formatDate(loan.pickupDate)}</time></td>
                  <td>{TERM_LABEL[loan.term]}</td>
                  <td>{loan.quantity}</td>
                  <td>{loan.userEmail}</td>
                  <td>
                    <div className="row-actions">
                      <form action={reviewLoan.bind(null, loan.id, 'approved')}><button className="small-button primary" type="submit">Duyệt</button></form>
                      <form action={reviewLoan.bind(null, loan.id, 'rejected')}><button className="small-button" type="submit">Từ chối</button></form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
