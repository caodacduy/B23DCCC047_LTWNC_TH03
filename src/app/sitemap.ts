import type { MetadataRoute } from 'next';
import { loadBooks } from '@/lib/books';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = 'http://localhost:3000';
  const books = await loadBooks();
  return [
    { url: origin },
    { url: `${origin}/books` },
    ...books.map(({ id }) => ({ url: `${origin}/books/${id}` })),
  ];
}
