// import { CacheService, createRedisClient } from "@/services/cacheService";
// import { jest } from "@jest/globals";
// import Redis from "ioredis";

// // Mock ioredis
// jest.mock("ioredis", () => {
//   // Mock implementation of Redis
//   const mRedis = {
//     setex: jest.fn().mockResolvedValue("OK"),
//     get: jest.fn(),
//     del: jest.fn().mockResolvedValue(1),
//     exists: jest.fn().mockResolvedValue(1),
//     flushall: jest.fn().mockResolvedValue("OK"),
//     ttl: jest.fn().mockResolvedValue(100),
//     mget: jest.fn().mockResolvedValue(["value1", null]),
//     pipeline: jest.fn().mockReturnValue({
//       setex: jest.fn().mockReturnThis(),
//       set: jest.fn().mockReturnThis(),
//       exec: jest.fn().mockResolvedValue([]),
//     }),
//     quit: jest.fn().mockResolvedValue("OK"),
//     disconnect: jest.fn(),
//     status: "ready",
//   };

//   return jest.fn(() => mRedis);
// });

// describe("CacheService", () => {
//   let cacheService: CacheService;
//   let redisClient: Redis;

//   beforeEach(() => {
//     // Create a new Redis client for each test
//     redisClient = createRedisClient();
//     cacheService = new CacheService(redisClient);
//   });

//   afterEach(async () => {
//     // Clean up Redis connection after each test
//     await cacheService.quit();
//   });

//   test("should set and get value", async () => {
//     // Given
//     const key = "test-key";
//     const value = { name: "test-value" };
//     const mockRedisClient = cacheService.getRedisClient() as any;
//     mockRedisClient.get.mockResolvedValueOnce(JSON.stringify(value));

//     // When
//     await cacheService.set(key, value);
//     const result = await cacheService.get(key);

//     // Then
//     expect(mockRedisClient.setex).toHaveBeenCalled();
//     expect(result).toEqual(value);
//   });

//   test("should delete value", async () => {
//     // Given
//     const key = "test-key";

//     // When
//     await cacheService.delete(key);

//     // Then
//     const mockRedisClient = cacheService.getRedisClient() as any;
//     expect(mockRedisClient.del).toHaveBeenCalledWith(key);
//   });

//   test("should check if key exists", async () => {
//     // Given
//     const key = "test-key";
//     const mockRedisClient = cacheService.getRedisClient() as any;

//     // When - exists returns 1 from our mock
//     const result = await cacheService.exists(key);

//     // Then
//     expect(mockRedisClient.exists).toHaveBeenCalledWith(key);
//     expect(result).toBe(true);
//   });
  
//   test("should properly disconnect Redis client", async () => {
//     // When
//     await cacheService.quit();
    
//     // Then
//     const mockRedisClient = cacheService.getRedisClient() as any;
//     expect(mockRedisClient.quit).toHaveBeenCalled();
//   });
// });