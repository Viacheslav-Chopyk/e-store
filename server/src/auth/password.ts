import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;
const KEY_LENGTH = 64;

// Stored as "salt:hash". A random salt per user means two equal passwords get different hashes.
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = await scryptAsync(password, salt, KEY_LENGTH);
  return `${salt}:${hash.toString('hex')}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [salt, hashHex] = stored.split(':');
  const expected = Buffer.from(hashHex ?? '', 'hex');
  // Malformed value (e.g. a plain password typed into the DB by hand) — treat as a wrong password, not a crash.
  if (!salt || expected.length !== KEY_LENGTH) {
    return false;
  }
  const hash = await scryptAsync(password, salt, KEY_LENGTH);
  // Constant-time comparison so response timing doesn't leak how many bytes matched.
  return timingSafeEqual(hash, expected);
}
