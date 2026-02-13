import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http.error';

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = getStatusCode(err);
  const message = err instanceof Error ? err.message : 'Internal server error';
  const code = getErrorCode(err, statusCode);
  const details = err instanceof HttpError ? err.details : undefined;

  res.status(statusCode).json({
    message,
    code,
    requestId: req.requestId,
    ...(details ? { details } : {}),
  });
};

const getStatusCode = (error: unknown): number => {
  if (error instanceof HttpError) {
    return error.statusCode;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    typeof error.statusCode === 'number'
  ) {
    return error.statusCode;
  }

  return 500;
};

const getErrorCode = (error: unknown, statusCode: number): string => {
  if (error instanceof HttpError) {
    return error.code;
  }

  if (statusCode === 400) {
    return 'VALIDATION_ERROR';
  }

  if (statusCode === 404) {
    return 'NOT_FOUND';
  }

  return 'INTERNAL_ERROR';
};
