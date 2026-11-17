import Link from 'next/link';
import { Brand } from '@/components/Brand';

export function Header() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Brand />
        <nav aria-label="Menu chính">
          <Link href="/">Trang chủ</Link>
          <Link href="/books">Sách</Link>
        </nav>
      </div>
    </header>
  );
}
