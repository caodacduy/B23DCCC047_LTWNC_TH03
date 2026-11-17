'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { safeReturnUrl } from '@/lib/return-url';

export async function login(
  callbackUrl: string,
  _previous: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: safeReturnUrl(callbackUrl),
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError && error.type === 'CredentialsSignin') {
      return { error: 'Email hoặc mật khẩu không đúng' };
    }
    throw error;
  }
}
