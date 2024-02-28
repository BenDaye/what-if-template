import { Redis } from 'ioredis';
import { env } from './env';

const redisGlobal = global as typeof global & {
  redis?: Redis;
};

export const redis: Redis =
  redisGlobal.redis ??
  new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

if (env.NODE_ENV !== 'production') {
  redisGlobal.redis = redis;
}

export const redisKeyMap: Record<string, string> = {
  metaAppTitle: 'meta:app:title',
  metaAppDescription: 'meta:app:description',
  metaDashboardTitle: 'meta:dashboard:title',
  metaDashboardDescription: 'meta:dashboard:description',
} as const;
