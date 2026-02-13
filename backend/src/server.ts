import { createApp } from './app';

const PORT = Number(process.env.PORT ?? 3001);

const startServer = async (): Promise<void> => {
  const app = await createApp();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

void startServer();
