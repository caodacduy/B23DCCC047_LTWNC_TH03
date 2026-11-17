import Link from 'next/link';

export default function BookNotFound() {
  return (
    <section className="panel detail">
      <p className="eyebrow">Lỗi 404</p>
      <h1>Không tìm thấy sách</h1>
      <p>Cuốn sách này không có trong danh mục của thư viện.</p>
      <Link className="button primary" href="/books">Về danh mục sách</Link>
    </section>
  );
}
