import { expect, it } from 'vitest';
import { safeReturnUrl } from './return-url';

it('giữ đường dẫn nội bộ và mã sách từ trang chi tiết', () => {
  expect(safeReturnUrl('/loans?book=6')).toBe('/loans?book=6');
});

it.each(['https://example.net', '//example.net', '/dir/..//example.net', '/\\example.net'])(
  'không chuyển hướng đăng nhập ra ngoài: %s',
  (value) => { expect(safeReturnUrl(value)).toBe('/loans'); },
);
