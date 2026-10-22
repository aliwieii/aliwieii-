import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'development-only-secret-change-me'
);

export async function hashPassword(v: string) {
  return bcrypt.hash(v, 12);
}

export async function verifyPassword(v: string, h: string) {
  return bcrypt.compare(v, h);
}

export async function signSession(payload: { sub: string; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifySession(token: string) {
  try {
    return (await jwtVerify(token, secret)).payload as { sub: string; role: string };
  } catch {
    return null;
  }
}
