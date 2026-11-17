import Link from 'next/link';
import { loadBooks } from '@/lib/books';
import { CATEGORIES } from '@/data/books';

export default async function HomePage() {
  const books = await loadBooks();
  const counts = CATEGORIES.map((category) => ({
    category,
    count: books.filter((book) => book.category === category).length,
  })).filter(({ count }) => count > 0);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Không gian học tập · PTIT</p>
          <h1>Thư viện khoa CNTT PTIT</h1>
          <p className="hero-text">Tìm tài liệu theo môn học và đăng ký mượn sách trực tuyến.</p>
          <p className="hero-count">{books.length} đầu sách · {counts.length} chuyên mục</p>
          <Link className="button primary" href="/books">Xem danh mục sách <span aria-hidden="true">↗</span></Link>
        </div>
        <svg className="shelf" viewBox="0 0 380 260" aria-hidden="true">
          <circle cx="190" cy="135" r="113" fill="#fbf3e7" />
          <circle cx="190" cy="135" r="99" fill="none" stroke="#e9ccac" strokeDasharray="4 6" />
          <path d="M49 214h282" stroke="#261831" strokeWidth="4" strokeLinecap="round" />
          <rect x="80" y="90" width="37" height="122" rx="5" fill="#a73548" />
          <rect x="121" y="56" width="42" height="156" rx="5" fill="#37294d" />
          <rect x="167" y="76" width="46" height="136" rx="5" fill="#dfad67" />
          <rect x="217" y="103" width="33" height="109" rx="5" fill="#78638f" />
          <rect x="254" y="97" width="33" height="116" rx="5" fill="#a73548" transform="rotate(-14 270 210)" />
          <path d="M88 107h21m-21 86h21m41-119h-21m21 12h-21m21 107h-21m44-98h34m-34 89h34m-34 9h34m-28-72v45m44-47h21m-21 72h21" stroke="#fff4e6" strokeWidth="2.5" strokeLinecap="round" opacity=".8" />
          <path d="M280 59v18m-9-9h18M59 132v12m-6-6h12" stroke="#a73548" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </section>
      <section className="categories" aria-labelledby="categories-title">
        <p className="eyebrow">Khám phá danh mục</p>
        <h2 id="categories-title">Chuyên mục sách</h2>
        <div className="category-grid">
          {counts.map(({ category, count }, index) => (
            <Link key={category} className="category-card" href={{ pathname: '/books', query: { category } }}>
              <span className="category-index">{String(index + 1).padStart(2, '0')}</span>
              <strong>{category}</strong>
              <small>{count} đầu sách</small>
              <span className="category-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
