import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { LoanForm } from '@/components/LoanForm';
import { db } from '@/lib/db';
import { formatDate, STATUS_LABEL, TERM_LABEL } from '@/lib/format';
import { listLoans, parseStatus } from '@/lib/loans';
import { can } from '@/lib/permissions';
import { first } from '@/lib/query';
import type { Query } from '@/lib/query';
import type { LoanStatus } from '@/types';
import { cancelLoanAction, createLoanAction } from './actions';

export const metadata: Metadata = { title: 'Sách đã mượn', robots: { index: false } };

const STATUSES: readonly LoanStatus[] = ['pending', 'approved', 'rejected'];

export default async function LoansPage({ searchParams }: { searchParams: Promise<Query> }) {
  const user = (await auth())?.user;
  if (!user?.email) redirect('/login?callbackUrl=%2Floans');
  const viewAll = can(user.role, 'loan:view-all');
  const viewOwn = can(user.role, 'loan:view-own');
  if (!viewAll && !viewOwn) redirect('/forbidden');

  const params = await searchParams;
  const status = parseStatus(first(params.status));
  const requestedPage = Number(first(params.page) ?? 1);
  const { items, total, page, totalPages } = listLoans({ email: user.email, role: user.role }, status, requestedPage);
  const allowCreate = can(user.role, 'loan:create');
  const defaultBookId = db.books.find(({ id }) => String(id) === first(params.book))?.id;

  function pageHref(value: number) {
    const query = new URLSearchParams();
    if (status) query.set('status', status);
    query.set('page', String(value));
    if (defaultBookId && allowCreate) query.set('book', String(defaultBookId));
    return `/loans?${query}`;
  }

  return (
    <>
      <div className="page-heading">
        <h1>Sách đã mượn</h1>
        <p>{viewAll ? 'Danh sách yêu cầu của tất cả sinh viên.' : 'Theo dõi tình trạng yêu cầu mượn sách của bạn.'}</p>
      </div>
      {allowCreate && (
        <section className="loan-section" aria-labelledby="loan-form-title">
          <h2 id="loan-form-title">Đăng ký mượn sách</h2>
          <LoanForm key={defaultBookId ?? 'new'} books={db.books} defaultBookId={defaultBookId} action={createLoanAction} />
        </section>
      )}
      <form className="panel filters" action="/loans" method="get">
        <div className="field">
          <label htmlFor="status">Trạng thái</label>
          <select id="status" name="status" defaultValue={status ?? ''}>
            <option value="">Tất cả</option>
            {STATUSES.map((item) => <option key={item} value={item}>{STATUS_LABEL[item]}</option>)}
          </select>
        </div>
        <button className="primary" type="submit">Lọc</button>
      </form>
      <div className="result-heading"><h2>Danh sách yêu cầu</h2><p className="muted">{total} yêu cầu</p></div>
      {items.length === 0 ? <p className="panel empty">Không có yêu cầu mượn sách.</p> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Sách</th><th scope="col">Ngày lấy</th><th scope="col">Thời hạn</th>
                <th scope="col">Số quyển</th><th scope="col">Trạng thái</th>
                {viewAll && <th scope="col">Người mượn</th>}
                {allowCreate && <th scope="col">Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((loan) => (
                <tr key={loan.id}>
                  <td><Link className="text-link" href={`/books/${loan.bookId}`}>{loan.bookTitle}</Link></td>
                  <td><time dateTime={loan.pickupDate}>{formatDate(loan.pickupDate)}</time></td>
                  <td>{TERM_LABEL[loan.term]}</td>
                  <td>{loan.quantity} quyển</td>
                  <td><span className={`tag ${loan.status}`}>{STATUS_LABEL[loan.status]}</span></td>
                  {viewAll && <td>{loan.userEmail}</td>}
                  {allowCreate && (
                    <td>
                      {loan.status === 'pending' && loan.userEmail === user.email && (
                        <form action={cancelLoanAction.bind(null, loan.id)}>
                          <button className="small-button" type="submit">Hủy</button>
                        </form>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <nav className="pagination" aria-label="Phân trang">
        {page > 1 ? <Link className="text-link" href={pageHref(page - 1)}>Trước</Link> : <span aria-disabled="true">Trước</span>}
        <strong>Trang {page}/{totalPages}</strong>
        {page < totalPages ? <Link className="text-link" href={pageHref(page + 1)}>Sau</Link> : <span aria-disabled="true">Sau</span>}
      </nav>
    </>
  );
}
