import Link from 'next/link';

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Thư viện khoa CNTT PTIT — Trang chủ">
      <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill="currentColor" />
        <path d="M10 12c4.5-1 7.8 0 10 2.4 2.2-2.4 5.5-3.4 10-2.4v15c-4.5-1-7.8 0-10 2.4-2.2-2.4-5.5-3.4-10-2.4V12Zm10 2.4v15" fill="none" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <span>Thư viện <strong>PTIT</strong><small>KHOA CÔNG NGHỆ THÔNG TIN</small></span>
    </Link>
  );
}
