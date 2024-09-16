import { hash as bcHash, compare as bcCompare } from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hashes a string using bcrypt.
 *
 * @param text the string to hash
 * @returns the hashed string
 */
export async function hash(text: string) {
	return await bcHash(text, SALT_ROUNDS);
}

/**
 * Compares a string to a hash using bcrypt.
 *
 * @param text the string to compare
 * @param hash the hash to compare to
 * @returns whether the string matches the hash
 */
export async function compare(text: string, hash: string) {
	return await bcCompare(text, hash);
}
