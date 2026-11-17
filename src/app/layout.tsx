import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Header } from '@/components/Header';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: { default: 'Thư viện khoa CNTT', template: '%s | Thư viện khoa' },
  description: 'Tra cứu và đăng ký mượn sách tại Thư viện khoa CNTT PTIT.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <a className="skip-link" href="#main-content">Đến nội dung chính</a>
        <Header />
        <main id="main-content" className="shell main">{children}</main>
        <footer className="site-footer">
          <div className="shell footer-inner">
            <strong>Thư viện khoa CNTT PTIT</strong>
            <span>Học viện Công nghệ Bưu chính Viễn thông</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
