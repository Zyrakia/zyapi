import { parse as ms } from '@lukeed/ms';
import NodeCache from 'node-cache';

const memoryCache = new NodeCache();

/**
 * Parses a TTL value into seconds, or throws an error if the value is invalid.
 *
 * @param ttl the TTL to parse in milliseconds or a parsable string
 * @returns the number of seconds the TTL represents
 */
const parseMilliseconds = (ttl: string | number) => {
	const ttlMs = typeof ttl === 'number' ? ttl : ms(ttl);
	if (ttlMs === undefined || isNaN(ttlMs)) throw new Error('Invalid TTL provided: "' + ttl + '".');

	return Math.floor(ttlMs / 1000);
};

/**
 * Wraps a function in a cache, using the provided key and TTL.
 *
 * @param key the key to use for the cache
 * @param ttl the time to live of the cache, in milliseconds or a string parsable by `ms`.
 * @param provider the function to wrap in the cache
 * @returns the result of the function
 */
export function cached<R>(key: string, ttl: string | number, provider: () => R): R {
	const ttlSeconds = parseMilliseconds(ttl);
	const cachedValue = memoryCache.get(key);
	if (cachedValue !== undefined) {
		return cachedValue as R;
	}

	const value = provider();
	memoryCache.set(key, value, ttlSeconds);

	return value;
}

/**
 * Method decorator that wraps a method in a cache, using the provided key and TTL.
 *
 * @param key the key to use for the cache
 * @param ttl the time to live of the cache, in milliseconds or a string parsable by `ms`.
 */
export function Cached(key: string, ttl: string | number): MethodDecorator {
	const ttlSeconds = parseMilliseconds(ttl);

	return (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;
		if (typeof originalMethod !== 'function')
			throw new Error('Cached decorator can only be used on methods.');

		descriptor.value = function (...args: any[]) {
			const cachedValue = memoryCache.get(key);
			if (cachedValue !== undefined) {
				return cachedValue;
			}

			const value = originalMethod.apply(this, args);
			memoryCache.set(key, value, ttlSeconds);
			return value;
		};
	};
}

/**
 * Invalidates a cache key, if it exists.
 *
 * @param key the key to invalidate
 */
export function invalidate(key: string) {
	memoryCache.del(key);
}
