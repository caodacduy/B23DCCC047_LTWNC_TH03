import { expect, it } from 'vitest';
import { formatDate } from './format';

it('hiển thị ngày lấy sách theo định dạng ngày/tháng/năm', () => {
  expect(formatDate('2026-12-02')).toBe('02/12/2026');
});
