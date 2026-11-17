'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { toLoanData, toLoanInput, validateLoan } from '@/lib/loan-validate';
import type { LoanFormState } from '@/lib/loan-validate';
import { cancelLoan, submitLoan } from '@/lib/loans';
import { can } from '@/lib/permissions';

async function studentEmail() {
  const user = (await auth())?.user;
  if (!user?.email || !can(user.role, 'loan:create')) throw new Error('Không có quyền');
  return user.email;
}

function refreshLoans() {
  revalidatePath('/loans');
  revalidatePath('/admin');
}

export async function createLoanAction(_prev: LoanFormState, formData: FormData): Promise<LoanFormState> {
  const email = await studentEmail();
  const values = toLoanInput(formData);
  const errors = validateLoan(values, db.books);
  if (Object.keys(errors).length > 0) return { errors, values };

  const result = submitLoan(email, toLoanData(values));
  if (!result.ok) return { errors: {}, values, message: result.message };

  refreshLoans();
  return { errors: {}, values: {}, message: 'Đã gửi yêu cầu, chờ duyệt', ok: true };
}

export async function cancelLoanAction(id: number) {
  const email = await studentEmail();
  if (cancelLoan(email, id) === 'ok') refreshLoans();
}
