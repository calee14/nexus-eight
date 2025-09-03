// lib/redis.ts
import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = createClient({
  url: redisUrl,
  // Optional configuration
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500)
  }
});

redis.on('error', (err) => console.log('Redis Client Error', err));

// Connect to Redis
export const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect();
    console.log('✅ Connected to Redis');
  }
  return redis;
};

// Graceful shutdown
process.on('SIGINT', () => {
  redis.destroy();
  process.exit(0);
});
