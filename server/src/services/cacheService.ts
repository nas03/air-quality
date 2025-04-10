import { cacheTime } from "@/config/constant";
import { ICacheService } from "@/interfaces/services/ICacheService";
import Redis from "ioredis";

export class CacheService implements ICacheService {
    private readonly redisClient = new Redis({
        username: "default",
        password: "evZA0KtsVBPoKsF4Vvt9z5Xa6yJlN5qh",
        port: 12511,
        host: "redis-12511.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com",
        disconnectTimeout: 0,
        maxRetriesPerRequest: 0,
    });

    async exists(key: string): Promise<boolean> {
        try {
            const exists = await this.redisClient.exists(key);
            return exists === 1;
        } catch (error) {
            console.error("Error checking exists:", error);
            return false;
        }
    }

    async clear(): Promise<void> {
        try {
            await this.redisClient.flushall();
        } catch (error) {
            console.error("Error clearing cache:", error);
        }
    }

    async ttl(key: string): Promise<number> {
        try {
            return await this.redisClient.ttl(key);
        } catch (error) {
            console.error("Error getting TTL:", error);
            return -1;
        }
    }

    async mset(keyValuePairs: Record<string, string>, ttlInSeconds?: number): Promise<void> {
        try {
            const pipeline = this.redisClient.pipeline();

            Object.entries(keyValuePairs).forEach(([key, value]) => {
                if (ttlInSeconds) {
                    pipeline.setex(key, ttlInSeconds, value);
                } else {
                    pipeline.set(key, value);
                }
            });

            await pipeline.exec();
        } catch (error) {
            console.error("Error setting multiple keys:", error);
        }
    }

    async mget(keys: string[]): Promise<(string | null)[]> {
        try {
            const values = await this.redisClient.mget(keys);
            return values.map((value) => value ?? null);
        } catch (error) {
            console.error("Error getting multiple keys:", error);
            return keys.map(() => null);
        }
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await this.redisClient.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error("Error getting value:", error);
            return null;
        }
    }

    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
        try {
            const serializedValue = JSON.stringify(value);
            if (ttlSeconds) {
                await this.redisClient.setex(key, ttlSeconds, serializedValue);
            } else {
                await this.redisClient.setex(key, cacheTime.DEFAULT, serializedValue);
            }
        } catch (error) {
            console.error("Error setting value:", error);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.redisClient.del(key);
        } catch (error) {
            console.error("Error deleting key:", error);
        }
    }
    async cache<T>(key: string, func: (() => Promise<T>) | T): Promise<T | null> {
        try {
            const cache = await this.redisClient.get(key);
            if (cache) return JSON.parse(cache);

            let data: T;
            if (typeof func === "function") {
                data = await (func as () => Promise<T>)();
            } else {
                data = func as T;
            }

            if (data) {
                const serializedData = JSON.stringify(data);
                await this.redisClient.setex(key, cacheTime.DEFAULT, serializedData);
                return data;
            }
            return null;
        } catch (error) {
            console.error("Error in cache function:", error);
            return null;
        }
    }
    generateRedisKey = (
        objectType: string,
        objectId: string | number,
        field: string | "*" = "*",
    ) => {
        return `${objectType}:${objectId}:${field}`;
    };
}
