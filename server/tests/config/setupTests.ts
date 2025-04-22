/* import dotenv from "dotenv";
import Redis from "ioredis";
import { CacheService, createRedisClient } from "../../src/services/cacheService";

dotenv.config();

// Keep track of the connection for proper cleanup
let redisClient: Redis | null = null;

// Create a single shared cache service instance with a managed Redis client
export const getCacheService = (): CacheService => {
    if (!redisClient) {
        // Only create the Redis client once
        redisClient = createRedisClient();

        // Enable logging for connection issues during tests
        redisClient.on("error", (err) => {
            console.error("Redis client error during tests:", err);
        });
    }

    return new CacheService(redisClient);
};

// Get instance to use across tests
export const cacheService = getCacheService();

// Mocha hooks (replacing Jest hooks)
before(() => {
    // Ensure Redis client is ready before tests start
    if (!redisClient) {
        throw new Error("Redis client is not defined");
    }
    if (redisClient.status === "end") {
        throw new Error("Redis connection is closed");
    }
});

// Clean up resources after all tests are done
after(async () => {
    // Make sure to properly disconnect all Redis clients
    if (redisClient) {
        console.log("Closing Redis connection after tests");
        await redisClient.quit();
        redisClient.disconnect(false); // Force disconnect after quit
    }

    // Wait a bit to ensure connections are properly closed
    await new Promise((resolve) => setTimeout(resolve, 100));
});
 */
