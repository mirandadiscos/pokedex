import type { NextFunction, Request, Response } from 'express';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const DEFAULT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX ?? 15);
const DEFAULT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000);

const bucket = new Map<string, RateLimitEntry>();

const getClientKey = (req: Request): string => req.ip || req.socket.remoteAddress || 'unknown';

export const createRateLimitMiddleware = (
  config: RateLimitConfig = {
    maxRequests: DEFAULT_MAX_REQUESTS,
    windowMs: DEFAULT_WINDOW_MS,
  },
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    const key = getClientKey(req);

    const current = bucket.get(key);
    if (!current || current.resetAt <= now) {
      bucket.set(key, {
        count: 1,
        resetAt: now + config.windowMs,
      });

      next();
      return;
    }

    if (current.count >= config.maxRequests) {
      res.status(429).json({
        message: 'Você excedeu o limite de requisições. Por favor, tente novamente mais tarde.',
        code: 'RATE_LIMIT_EXCEEDED',
        requestId: req.requestId,
      });
      return;
    }

    current.count += 1;
    bucket.set(key, current);
    next();
  };
};
