import { describe, expect, it } from 'vitest';
import { can } from './permissions';
import type { Action } from './permissions';

const actions: readonly Action[] = ['book:view', 'loan:create', 'loan:view-own', 'loan:view-all', 'loan:review'];

describe('Quyền thư viện', () => {
  it('khách chỉ được xem sách', () => {
    expect(actions.filter((action) => can(undefined, action))).toEqual(['book:view']);
  });

  it('sinh viên được gửi và xem yêu cầu của mình, không được duyệt', () => {
    expect(actions.filter((action) => can('student', action))).toEqual(['book:view', 'loan:create', 'loan:view-own']);
  });

  it('thủ thư được xem tất cả và duyệt, không được gửi yêu cầu', () => {
    expect(actions.filter((action) => can('admin', action))).toEqual(['book:view', 'loan:view-all', 'loan:review']);
  });
});
