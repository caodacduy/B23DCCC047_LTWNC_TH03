'use client';

import { useActionState, useId } from 'react';
import type { ReactNode } from 'react';
import { TERMS } from '@/data/books';
import { TERM_LABEL } from '@/lib/format';
import type { LoanFormState, LoanInput } from '@/lib/loan-validate';
import type { Book } from '@/types';

interface Props {
  books: readonly Book[];
  defaultBookId?: number;
  action: (previous: LoanFormState, data: FormData) => Promise<LoanFormState>;
}

const INITIAL_STATE: LoanFormState = { errors: {}, values: {} };

export function LoanForm({ books, defaultBookId, action }: Props) {
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);
  const id = useId();
  const { errors, values } = state;

  function field(
    name: keyof LoanInput,
    label: string,
    render: (props: {
      id: string;
      name: keyof LoanInput;
      'aria-invalid': boolean;
      'aria-describedby'?: string;
    }) => ReactNode,
    full = false,
  ) {
    const inputId = `${id}-${name}`;
    const message = errors[name];
    const errorId = `${inputId}-error`;
    return (
      <div className={full ? 'field full' : 'field'}>
        <label htmlFor={inputId}>{label}</label>
        {render({
          id: inputId,
          name,
          'aria-invalid': Boolean(message),
          'aria-describedby': message ? errorId : undefined,
        })}
        {message && <p id={errorId} className="error" role="alert">{message}</p>}
      </div>
    );
  }

  return (
    <form className="panel loan-grid" key={JSON.stringify(state)} action={formAction} noValidate>
      {field('bookId', 'Sách', (props) => (
        <select {...props} defaultValue={values.bookId ?? (state.ok ? '' : (defaultBookId ?? ''))}>
          <option value="">-- Chọn sách --</option>
          {books.map((book) => <option key={book.id} value={book.id}>{book.title} ({book.copies} bản)</option>)}
        </select>
      ))}
      {field('pickupDate', 'Ngày lấy sách', (props) => <input {...props} type="date" defaultValue={values.pickupDate ?? ''} />)}
      {field('term', 'Thời hạn mượn', (props) => (
        <select {...props} defaultValue={values.term ?? ''}>
          <option value="">-- Chọn thời hạn --</option>
          {TERMS.map((term) => <option key={term} value={term}>{TERM_LABEL[term]}</option>)}
        </select>
      ))}
      {field('quantity', 'Số quyển', (props) => <input {...props} type="number" min={1} step={1} defaultValue={values.quantity ?? '1'} />)}
      {field('reason', 'Lý do mượn', (props) => (
        <textarea {...props} rows={3} defaultValue={values.reason ?? ''} placeholder="Nhập ít nhất 10 ký tự" />
      ), true)}
      <div className="full">
        <button className="primary" type="submit" disabled={pending}>Gửi yêu cầu</button>
      </div>
      {state.message && <p className={state.ok ? 'success full' : 'error full'} role={state.ok ? 'status' : 'alert'}>{state.message}</p>}
    </form>
  );
}
