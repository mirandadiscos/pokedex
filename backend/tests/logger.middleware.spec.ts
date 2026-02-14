import type { NextFunction, Request, Response } from 'express';
import { LoggerMiddleware } from '../src/middlewares/logger.middleware';

describe('logger middleware', () => {
  it('calls next', () => {
    const write = jest.fn();
    const logger = new LoggerMiddleware(write);

    const req = {
      requestId: 'req-1',
      method: 'GET',
      originalUrl: '/api/pokemons',
      url: '/api/pokemons',
    } as Request;

    const listeners: Record<string, () => void> = {};
    const res = {
      statusCode: 200,
      on: jest.fn((event: string, listener: () => void) => {
        listeners[event] = listener;
      }),
    } as unknown as Response;

    const next = jest.fn() as unknown as NextFunction;

    logger.handle(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(write).not.toHaveBeenCalled();
    expect(listeners.finish).toBeDefined();
  });

  it('writes one JSON line with request metadata when response finishes', () => {
    const write = jest.fn();
    const logger = new LoggerMiddleware(write);

    const nowSpy = jest.spyOn(Date, 'now');
    nowSpy.mockReturnValueOnce(1_000).mockReturnValueOnce(1_025);

    const req = {
      requestId: 'req-xyz',
      method: 'GET',
      originalUrl: '/health',
      url: '/health',
    } as Request;

    const listeners: Record<string, () => void> = {};
    const res = {
      statusCode: 204,
      on: jest.fn((event: string, listener: () => void) => {
        listeners[event] = listener;
      }),
    } as unknown as Response;

    const next = jest.fn() as unknown as NextFunction;

    logger.handle(req, res, next);
    listeners.finish();

    expect(write).toHaveBeenCalledTimes(1);
    const [line] = write.mock.calls[0] as [string];
    expect(line.endsWith('\n')).toBe(true);

    const payload = JSON.parse(line) as {
      timestamp: string;
      level: 'info';
      requestId: string;
      method: string;
      path: string;
      status: number;
      durationMs: number;
    };

    expect(payload.level).toBe('info');
    expect(payload.requestId).toBe('req-xyz');
    expect(payload.method).toBe('GET');
    expect(payload.path).toBe('/health');
    expect(payload.status).toBe(204);
    expect(payload.durationMs).toBe(25);
    expect(payload.timestamp.endsWith('Z')).toBe(true);
    expect(() => new Date(payload.timestamp)).not.toThrow();

    nowSpy.mockRestore();
  });
});
