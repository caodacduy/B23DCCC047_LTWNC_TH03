import { LIBRARY_TIME_ZONE } from '@/lib/clock';
import { TERMS } from '@/data/books';
import type { Book, Term } from '@/types';

export interface LoanInput {
  bookId: string;
  pickupDate: string;
  term: string;
  quantity: string;
  reason: string;
}

export interface LoanData {
  bookId: number;
  pickupDate: string;
  term: Term;
  quantity: number;
  reason: string;
}

export type LoanErrors = Partial<Record<keyof LoanInput, string>>;

export interface LoanFormState {
  errors: LoanErrors;
  values: Partial<LoanInput>;
  message?: string;
  ok?: boolean;
}

const dateInVietnam = new Intl.DateTimeFormat('sv-SE', {
  timeZone: LIBRARY_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function today(): string {
  return dateInVietnam.format();
}

export function toLoanInput(raw: FormData | Partial<Record<keyof LoanInput, unknown>>): LoanInput {
  function stringField(name: keyof LoanInput): string {
    const value = raw instanceof FormData ? raw.get(name) : raw[name];
    return typeof value === 'string' ? value : '';
  }

  return {
    bookId: stringField('bookId'),
    pickupDate: stringField('pickupDate'),
    term: stringField('term'),
    quantity: stringField('quantity'),
    reason: stringField('reason'),
  };
}

function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateLoan(input: LoanInput, books: readonly Book[]): LoanErrors {
  const errors: LoanErrors = {};
  const book = books.find(({ id }) => String(id) === input.bookId);
  if (!book) errors.bookId = 'Hãy chọn sách';

  if (!isCalendarDate(input.pickupDate)) {
    errors.pickupDate = 'Hãy chọn ngày';
  } else if (input.pickupDate < today()) {
    errors.pickupDate = 'Ngày lấy sách không được ở quá khứ';
  }

  if (!TERMS.some((term) => String(term) === input.term)) errors.term = 'Hãy chọn thời hạn';

  const quantity = Number(input.quantity);
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    errors.quantity = 'Số quyển phải từ 1 trở lên';
  } else if (book && quantity > book.copies) {
    errors.quantity = `Vượt số bản của sách (${book.copies} bản)`;
  }

  if (input.reason.trim().length < 10) errors.reason = 'Lý do tối thiểu 10 ký tự';
  return errors;
}

// Chỉ gọi sau khi validateLoan không trả lỗi.
export function toLoanData(input: LoanInput): LoanData {
  return {
    bookId: Number(input.bookId),
    pickupDate: input.pickupDate,
    term: Number(input.term) as Term,
    quantity: Number(input.quantity),
    reason: input.reason.trim(),
  };
}
