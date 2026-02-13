import type { NextFunction, Request, Response } from 'express';

type LogWriter = (line: string) => void;

interface HttpLogEntry {
  timestamp: string;
  level: 'info';
  requestId: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
}

export class LoggerMiddleware {
  constructor(
    private readonly write: LogWriter = (line: string) => {
      process.stdout.write(line);
    },
  ) {}

  handle = (req: Request, res: Response, next: NextFunction): void => {
    const requestStartMs = Date.now();

    res.on('finish', () => {
      const requestEndMs = Date.now();
      const durationMs = requestEndMs - requestStartMs;

      const logEntry: HttpLogEntry = {
        timestamp: new Date().toISOString(),
        level: 'info',
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl || req.url,
        status: res.statusCode,
        durationMs,
      };

      this.write(`${JSON.stringify(logEntry)}\n`);
    });

    next();
  };
}
