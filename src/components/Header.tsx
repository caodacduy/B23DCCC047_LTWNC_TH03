'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Brand } from '@/components/Brand';
import { can } from '@/lib/permissions';

async function logout() {
  await signOut({ redirect: false, redirectTo: '/' });
  // Tải lại trang để bỏ cache điều hướng của phiên vừa đăng xuất.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign('/');
}

export function Header() {
  const pathname = usePathname();
  const { data, status } = useSession();
  const user = data?.user;
  const active = (path: string) =>
    (pathname === path || (path !== '/' && pathname.startsWith(path + '/'))) ? 'page' : undefined;

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Brand />
        <nav aria-label="Menu chính">
          <Link href="/" aria-current={active('/')}>Trang chủ</Link>
          <Link href="/books" aria-current={active('/books')}>Sách</Link>
          {user && (
            <>
              <Link href="/loans" aria-current={active('/loans')}>Sách đã mượn</Link>
              {can(user.role, 'loan:review') && <Link href="/admin" aria-current={active('/admin')}>Quản trị</Link>}
              <span className="account-name">Xin chào, {user.name} ({user.role})</span>
              <button type="button" className="small-button" onClick={() => void logout()}>Đăng xuất</button>
            </>
          )}
          {status === 'unauthenticated' && <Link className="button small-button" href="/login" aria-current={active('/login')}>Đăng nhập</Link>}
        </nav>
      </div>
    </header>
  );
}
