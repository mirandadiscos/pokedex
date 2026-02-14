import type { NextFunction, Request, Response } from 'express';
import { requestIdMiddleware } from '../src/middlewares/request-id.middleware';

describe('request id middleware', () => {
  it('uses incoming x-request-id when provided', () => {
    const req = {
      header: jest.fn().mockReturnValue('external-123'),
    } as unknown as Request;

    const res = {
      setHeader: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as unknown as NextFunction;

    requestIdMiddleware(req, res, next);

    expect(req.requestId).toBe('external-123');
    expect((res.setHeader as unknown as jest.Mock)).toHaveBeenCalledWith('x-request-id', 'external-123');
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('generates request id when header is absent', () => {
    const req = {
      header: jest.fn().mockReturnValue(undefined),
    } as unknown as Request;

    const res = {
      setHeader: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as unknown as NextFunction;

    requestIdMiddleware(req, res, next);

    expect(typeof req.requestId).toBe('string');
    expect(req.requestId.length).toBeGreaterThan(0);
    expect((res.setHeader as unknown as jest.Mock)).toHaveBeenCalledWith('x-request-id', req.requestId);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
