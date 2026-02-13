import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../src/errors/http.error';
import { errorMiddleware } from '../src/middlewares/error.middleware';

describe('error middleware', () => {
  it('returns structured payload for HttpError', () => {
    const req = { requestId: 'req-100' } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = (() => undefined) as NextFunction;

    const error = new HttpError(400, 'bad request', 'VALIDATION_ERROR', { foo: 'bar' });

    errorMiddleware(error, req, res, next);

    expect((res.status as unknown as jest.Mock)).toHaveBeenCalledWith(400);
    expect((res.json as unknown as jest.Mock)).toHaveBeenCalledWith({
      message: 'bad request',
      code: 'VALIDATION_ERROR',
      requestId: 'req-100',
      details: { foo: 'bar' },
    });
  });

  it('falls back to 500 and INTERNAL_ERROR', () => {
    const req = { requestId: 'req-500' } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = (() => undefined) as NextFunction;

    errorMiddleware(new Error('boom'), req, res, next);

    expect((res.status as unknown as jest.Mock)).toHaveBeenCalledWith(500);
    expect((res.json as unknown as jest.Mock)).toHaveBeenCalledWith({
      message: 'boom',
      code: 'INTERNAL_ERROR',
      requestId: 'req-500',
    });
  });
});
