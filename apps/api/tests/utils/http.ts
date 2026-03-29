import { Request, Response, NextFunction } from 'express';
import { vi } from 'vitest';

export function mockRequest(options: Partial<Request> = {}): Request {
    return {
        body: {},
        params: {},
        query: {},
        headers: {},
        cookies: {},
        user: undefined,
        ...options,
    } as Request;
}


export function mockResponse(): Response {
    const res = {} as Response;

    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    res.send = vi.fn().mockReturnValue(res);
    res.cookie = vi.fn().mockReturnValue(res);
    res.clearCookie = vi.fn().mockReturnValue(res);
    res.end = vi.fn().mockReturnValue(res);

    return res;
}

export function mockNext(): NextFunction {
    return vi.fn();
}

export function makeHttp() {
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();

    return { req, res, next };
}