import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { verifyPassword, signSession } from '../../../../lib/security';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const u = await db.user.findUnique({ where: { email } });
    if (!u || u.role !== 'ADMIN' || !(await verifyPassword(password, u.passwordHash))) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
    }
    const token = await signSession({ sub: u.id, role: u.role });
    const r = NextResponse.json({ ok: true });
    r.cookies.set('zoon_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return r;
  } catch {
    return NextResponse.json({ error: 'BAD_REQUEST' }, { status: 400 });
  }
}
