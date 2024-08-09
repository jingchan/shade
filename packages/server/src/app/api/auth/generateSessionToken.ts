import { randomUUID } from 'crypto';

export function generateSessionToken() {
  return randomUUID();
}
