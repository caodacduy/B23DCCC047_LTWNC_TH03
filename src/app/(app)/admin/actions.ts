'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { changeLoanStatus } from '@/lib/review';

export async function reviewLoan(id: number, status: 'approved' | 'rejected') {
  const session = await auth();
  if (!can(session?.user.role, 'loan:review')) throw new Error('Không có quyền');

  if (changeLoanStatus(id, status)) {
    revalidatePath('/admin');
  }
}
