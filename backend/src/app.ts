import 'reflect-metadata';
import cors from 'cors';
import express, { type Express } from 'express';
import { buildContainer } from './container';
import { errorMiddleware } from './middlewares/error.middleware';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { PokemonRoutes } from './routes/pokemon.routes';
import { requestIdMiddleware } from './middlewares/request-id.middleware';
import { createRateLimitMiddleware } from './middlewares/rate-limit.middleware';

const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const createApp = async (): Promise<Express> => {
  const app = express();
  const container = await buildContainer();
  const pokemonRoutes = new PokemonRoutes(container.pokemonController).build();
  const loggerMiddleware = new LoggerMiddleware();
  const apiRateLimitMiddleware = createRateLimitMiddleware();

  app.use(requestIdMiddleware);
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin not allowed by CORS: ${origin}`));
      },
    }),
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(loggerMiddleware.handle);

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api', apiRateLimitMiddleware, pokemonRoutes);
  app.use(errorMiddleware);

  return app;
};
