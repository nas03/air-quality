import { ICacheService } from "@/interfaces/external-library/ICacheService";
import Redis from "ioredis";

export class CacheService implements ICacheService {
  private readonly redisClient = new Redis();

  async exists(key: string): Promise<boolean> {
    const exists = await this.redisClient.exists(key);
    return exists === 1;
  }

  async clear(): Promise<void> {
    await this.redisClient.flushall();
  }

  async ttl(key: string): Promise<number> {
    return this.redisClient.ttl(key);
  }

  async mset(keyValuePairs: Record<string, string>, ttlInSeconds?: number): Promise<void> {
    const pipeline = this.redisClient.pipeline();

    Object.entries(keyValuePairs).forEach(([key, value]) => {
      if (ttlInSeconds) {
        pipeline.setex(key, ttlInSeconds, value);
      } else {
        pipeline.set(key, value);
      }
    });

    await pipeline.exec();
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    const values = await this.redisClient.mget(keys);
    return values.map((value) => value ?? null);
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serializedValue = JSON.stringify(value);
    if (ttlSeconds) {
      await this.redisClient.setex(key, ttlSeconds, serializedValue);
    } else {
      await this.redisClient.set(key, serializedValue);
    }
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
