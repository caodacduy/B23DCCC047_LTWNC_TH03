import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBook, loadBooks } from '@/lib/books';
import { localTime } from '@/lib/clock';

export const dynamic = 'force-static';
export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return (await loadBooks()).slice(0, 12).map((book) => ({ id: String(book.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = await getBook((await params).id);
  if (!book) notFound();
  return {
    title: `${book.title} – ${book.author}`,
    description: `Sách ${book.category}, thư viện có ${book.copies} bản.`,
  };
}

export default async function BookPage({ params }: Props) {
  const book = await getBook((await params).id);
  if (!book) notFound();

  return (
    <>
      <Link className="text-link back" href="/books">← Danh mục sách</Link>
      <article className="panel detail">
        <p className="eyebrow">Thông tin sách · #{String(book.id).padStart(2, '0')}</p>
        <h1>{book.title}</h1>
        <dl className="book-details">
          <div><dt>Tác giả:</dt><dd>{book.author}</dd></div>
          <div><dt>Chuyên mục:</dt><dd>{book.category}</dd></div>
          <div><dt>Số bản:</dt><dd>{book.copies}</dd></div>
        </dl>
        <p className="muted">Cập nhật lúc: <time>{localTime()}</time></p>
        <Link className="button primary" href={`/loans?book=${book.id}`}>Mượn sách này <span aria-hidden="true">↗</span></Link>
      </article>
    </>
  );
}
