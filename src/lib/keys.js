import { createHash, randomBytes } from 'node:crypto';

export const hashKey = (key) => createHash('sha256').update(key).digest('hex');

export function generateKey(kind) {
  const prefix = kind === 'secret' ? 'sk_live_' : 'pk_live_';
  return prefix + randomBytes(32).toString('base64url');
}
