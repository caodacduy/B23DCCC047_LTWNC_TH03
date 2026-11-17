import type { Role } from '@/types';

export type Action = 'book:view' | 'loan:create' | 'loan:view-own' | 'loan:view-all' | 'loan:review';

const permissions: Record<Role | 'guest', ReadonlySet<Action>> = {
  guest: new Set(['book:view']),
  student: new Set(['book:view', 'loan:create', 'loan:view-own']),
  admin: new Set(['book:view', 'loan:view-all', 'loan:review']),
};

export function can(role: Role | undefined, action: Action): boolean {
  return (permissions[role ?? 'guest'] ?? permissions.guest).has(action);
}
