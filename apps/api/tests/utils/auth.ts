import { Request } from 'express';
import { AuthedRequest } from '../../src/middleware/authMiddleware';
import type { Role } from '../../src/types/index';

export function attachUser(req: AuthedRequest,
  overrides: Partial<{id: string; role: Role; organizationId: string; organizationRole: string;}> = {}
): Request {
  req.user = {
    id: 'user-1',
    role: 'admin' as Role,
    organizationId: 'org-1',
    organizationRole: 'admin',
    ...overrides,
  };

  return req;
}


export function makeAuthedRequest(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    cookies: {},
    user: {
      id: 'user-1',
      role: 'admin',
      organizationId: 'org-1',
      organizationRole: 'admin',
    },
    ...overrides,
  } as Request;
}