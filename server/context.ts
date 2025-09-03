// server/context.ts
import { connectRedis, redis } from '../lib/redis';

export const createContext = async () => {
  // Ensure Redis connection
  await connectRedis();

  return {
    redis,
    // Your other context items (db, session, etc.)
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
