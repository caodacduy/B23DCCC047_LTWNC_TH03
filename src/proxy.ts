import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';

export default auth((request) => {
  const user = request.auth?.user;
  const { pathname, search } = request.nextUrl;

  if (!user?.email) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === '/admin' || pathname.startsWith('/admin/')) && !can(user.role, 'loan:review')) {
    return NextResponse.redirect(new URL('/forbidden', request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/loans/:path*', '/admin/:path*'],
};
