import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { generateBooks } from '@/data/books';
import type { LoanFormState } from '@/lib/loan-validate';
import { LoanForm } from './LoanForm';

const books = generateBooks(24);
const submitButton = () => screen.getByRole('button', { name: 'Gửi yêu cầu' });

describe('Form đăng ký mượn sách', () => {
  it('hiển thị lỗi ngay dưới ô sách và liên kết lỗi với ô nhập', async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue({ errors: { bookId: 'Hãy chọn sách' }, values: {} });
    render(<LoanForm books={books} action={action} />);
    await user.click(submitButton());

    expect(await screen.findByRole('alert')).toHaveTextContent('Hãy chọn sách');
    expect(screen.getByLabelText('Sách')).toHaveAccessibleDescription('Hãy chọn sách');
  });

  it('gửi đúng sách, thời hạn, số quyển và lý do đã nhập', async () => {
    const user = userEvent.setup();
    const action = vi.fn<(previous: LoanFormState, data: FormData) => Promise<LoanFormState>>()
      .mockResolvedValue({ errors: {}, values: {}, message: 'Đã gửi yêu cầu, chờ duyệt', ok: true });
    render(<LoanForm books={books} action={action} />);

    await user.selectOptions(screen.getByLabelText('Sách'), '3');
    fireEvent.change(screen.getByLabelText('Ngày lấy sách'), { target: { value: '2026-12-03' } });
    await user.selectOptions(screen.getByLabelText('Thời hạn mượn'), '14');
    await user.clear(screen.getByLabelText('Số quyển'));
    await user.type(screen.getByLabelText('Số quyển'), '2');
    await user.type(screen.getByLabelText('Lý do mượn'), 'Mượn để ôn tập');
    await user.click(submitButton());

    expect(await screen.findByRole('status')).toHaveTextContent('Đã gửi yêu cầu, chờ duyệt');
    expect(action).toHaveBeenCalledTimes(1);
    const [, data] = action.mock.calls[0];
    expect(Object.fromEntries(data)).toMatchObject({
      bookId: '3', pickupDate: '2026-12-03', term: '14', quantity: '2', reason: 'Mượn để ôn tập',
    });
    expect(screen.getByLabelText('Sách')).toHaveValue('');
    expect(screen.getByLabelText('Số quyển')).toHaveValue(1);
    expect(screen.getByLabelText('Lý do mượn')).toHaveValue('');
  });

  it('giữ dữ liệu sau khi máy chủ báo hết bản', async () => {
    const user = userEvent.setup();
    const action = vi.fn().mockResolvedValue({
      errors: {}, values: { bookId: '6', term: '14', quantity: '1', reason: 'Mượn để ôn tập' },
      message: 'Sách đã hết bản vào ngày này',
    });
    render(<LoanForm books={books} action={action} defaultBookId={6} />);

    await user.selectOptions(screen.getByLabelText('Thời hạn mượn'), '14');
    await user.type(screen.getByLabelText('Lý do mượn'), 'Mượn để ôn tập');
    await user.click(submitButton());

    expect(await screen.findByRole('alert')).toHaveTextContent('Sách đã hết bản vào ngày này');
    expect(screen.getByLabelText('Lý do mượn')).toHaveValue('Mượn để ôn tập');
    expect(screen.getByLabelText('Sách')).toHaveValue('6');
    expect(screen.getByLabelText('Thời hạn mượn')).toHaveValue('14');
  });

  it('chọn sẵn sách khi đến từ trang chi tiết', () => {
    render(<LoanForm books={books} action={vi.fn()} defaultBookId={6} />);
    expect(screen.getByLabelText('Sách')).toHaveDisplayValue('An toàn mạng (1 bản)');
  });
});
