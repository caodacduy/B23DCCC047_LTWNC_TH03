import { db } from '@/lib/db';
import type { Book } from '@/types';

export async function loadBooks({ category, q }: { category?: string; q?: string } = {}): Promise<Book[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const search = q?.trim().normalize('NFC').toLocaleLowerCase('vi-VN');
  return db.books.filter(
    (book) =>
      (!category || book.category === category) &&
      (!search || book.title.toLocaleLowerCase('vi-VN').includes(search)),
  );
}

export async function getBook(id: string): Promise<Book | undefined> {
  if (!/^[1-9]\d*$/.test(id)) return undefined;
  return db.books.find((book) => book.id === Number(id));
}
