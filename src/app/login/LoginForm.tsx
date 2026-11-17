'use client';

import { useActionState } from 'react';
import { login } from './actions';

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, action, pending] = useActionState(login.bind(null, callbackUrl), {});

  return (
    <form className="panel stacked-form" action={action}>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required />
      </div>
      <div className="field">
        <label htmlFor="password">Mật khẩu</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {state.error && <p className="error" role="alert">{state.error}</p>}
      <button className="primary" type="submit" disabled={pending}>Đăng nhập</button>
    </form>
  );
}
