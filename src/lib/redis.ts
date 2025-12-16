import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const globalForRedis = global as unknown as { redis: Redis | undefined };

export const redis =
  globalForRedis.redis ||
  new Redis(redisUrl, {
    maxRetriesPerRequest: 1, // Fail fast in dev
    tls: redisUrl.startsWith("rediss://") ? {} : undefined, // Required for Upstash
    retryStrategy(times) {
      if (times > 1) return null; // Stop retrying quickly to avoid hanging
      return 100;
    },
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

export default redis;
