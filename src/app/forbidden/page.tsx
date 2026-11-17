import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Không có quyền truy cập', robots: { index: false } };

export default function ForbiddenPage() {
  return (
    <section className="panel detail">
      <p className="eyebrow">Quyền truy cập</p>
      <h1>Bạn không có quyền truy cập trang này</h1>
      <Link className="button primary" href="/">Về trang chủ</Link>
    </section>
  );
}
