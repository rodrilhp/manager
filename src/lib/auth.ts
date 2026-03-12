import { randomBytes, scrypt as originalScrypt } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(originalScrypt);

export function getAuthUsers(): Record<string, string> {
  const envValue = process.env.AUTH_USERS?.trim();
  if (!envValue) {
    throw new Error('AUTH_USERS não está configurado. Use uma string JSON com usuários.');
  }

  let parsed;
  try {
    parsed = JSON.parse(envValue);
  } catch {
    throw new Error('AUTH_USERS precisa ser um JSON válido.');
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('AUTH_USERS precisa ser um objeto chave/valor.');
  }

  const users: Record<string, string> = {};

  for (const [rawUsername, rawPassword] of Object.entries(parsed)) {
    if (typeof rawUsername !== 'string' || rawUsername.length === 0) continue;
    if (typeof rawPassword !== 'string' || rawPassword.length === 0) continue;

    const normalized = rawUsername.toLowerCase().trim();
    users[normalized] = rawPassword;
  }

  return users;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, storedValue: string): Promise<boolean> {
  if (!storedValue.includes(':')) {
    return password === storedValue;
  }

  const [salt, hash] = storedValue.split(':');
  if (!salt || !hash) return false;

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return derivedKey.toString('hex') === hash;
}
