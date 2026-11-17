import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { first } from '@/lib/query';
import type { Query } from '@/lib/query';
import { safeReturnUrl } from '@/lib/return-url';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Đăng nhập', robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<Query> }) {
  if (await auth()) redirect('/');
  const callbackUrl = safeReturnUrl(first((await searchParams).callbackUrl));

  return (
    <section className="narrow">
      <div className="page-heading">
        <p className="eyebrow">Tài khoản thành viên</p>
        <h1>Đăng nhập</h1>
        <p>Đăng nhập để gửi hoặc quản lý yêu cầu mượn sách.</p>
      </div>
      <LoginForm callbackUrl={callbackUrl} />
    </section>
  );
}
