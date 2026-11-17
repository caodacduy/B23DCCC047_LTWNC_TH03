import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES } from '@/data/books';
import { loadBooks } from '@/lib/books';
import { localTime } from '@/lib/clock';
import { first } from '@/lib/query';
import type { Query } from '@/lib/query';

export const metadata: Metadata = { title: 'Danh mục sách' };

export default async function BooksPage({ searchParams }: { searchParams: Promise<Query> }) {
  const params = await searchParams;
  const q = first(params.q) ?? '';
  const category = CATEGORIES.find((item) => item === first(params.category)) ?? '';
  const books = await loadBooks({ category, q });

  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">Tra cứu tài liệu</p>
        <h1>Danh mục sách</h1>
        <p>Tìm sách theo tên hoặc chọn chuyên mục bạn quan tâm.</p>
      </div>
      <form className="panel filters" method="get" action="/books">
        <div className="field">
          <label htmlFor="q">Tìm sách</label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Ví dụ: lập trình" />
        </div>
        <div className="field">
          <label htmlFor="category">Chuyên mục</label>
          <select id="category" name="category" defaultValue={category}>
            <option value="">Tất cả</option>
            {CATEGORIES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <button className="primary" type="submit">Lọc</button>
      </form>
      <div className="result-heading">
        <h2>Tìm thấy {books.length} sách</h2>
        <p className="muted">Render lúc: <time>{localTime()}</time></p>
      </div>
      {books.length === 0 ? <p className="panel empty">Không tìm thấy sách nào.</p> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Tên sách</th><th scope="col">Tác giả</th><th scope="col">Chuyên mục</th><th scope="col">Số bản</th></tr></thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td><Link className="text-link" href={`/books/${book.id}`}>{book.title}</Link></td>
                  <td>{book.author}</td>
                  <td><span className="tag">{book.category}</span></td>
                  <td>Số bản: {book.copies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
