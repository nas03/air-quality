export interface ICacheService {
	/**
	 * Set a value in cache
	 */
	set(key: string, value: string, ttlInSeconds?: number): Promise<void>;

	/**
	 * Get a value from cache
	 */
	get(key: string): Promise<string | null>;

	/**
	 * Delete a value from cache
	 */
	delete(key: string): Promise<void>;

	/**
	 * Check if key exists in cache
	 */
	exists(key: string): Promise<boolean>;

	/**
	 * Clear all cache
	 */
	clear(): Promise<void>;

	/**
	 * Get time to live of a key in seconds
	 */
	ttl(key: string): Promise<number>;

	/**
	 * Set multiple values in cache
	 */
	mset(keyValuePairs: Record<string, string>, ttlInSeconds?: number): Promise<void>;

	/**
	 * Get multiple values from cache
	 */
	mget(keys: string[]): Promise<(string | null)[]>;

	/**
	 * Cache the result of a function
	 */
	cache<T>(key: string, func: () => Promise<T>): Promise<T | null>;

	/**
	 * Generate a standardized Redis key
	 */
	generateRedisKey(objectType: string, objectId: string | number, field: string | "*"): string;

	/**
	 * Quit/disconnect the Redis client - useful for testing and cleanup
	 */
	quit(): Promise<void>;

	/**
	 * Execute an operation and automatically close the Redis connection when done
	 */
	withClosableConnection<T>(operation: () => Promise<T>): Promise<T>;
}
