export function safeReturnUrl(value: string | undefined): string {
  if (!value?.startsWith('/') || value.startsWith('//') || value.includes('\\') || /\s/u.test(value)) {
    return '/loans';
  }
  const base = 'http://library.local';
  const url = new URL(value, base);
  return url.origin === base && !url.pathname.startsWith('//')
    ? `${url.pathname}${url.search}${url.hash}`
    : '/loans';
}
