'use client';

import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Server Action đổi cookie; tải lại phiên ở client khi rời trang đăng nhập.
  return <SessionProvider key={pathname === '/login' ? 'login' : 'library'}>{children}</SessionProvider>;
}
