'use client';
import { useState } from 'react';

export default function Login() {
  const [e, setE] = useState('');
  const [p, setP] = useState('');
  const [m, setM] = useState('');

  async function go(ev: any) {
    ev.preventDefault();
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: e, password: p }),
    });
    if (r.ok) location.href = '/admin';
    else setM('بيانات الدخول غير صحيحة');
  }

  return (
    <main className="page container">
      <div className="panel">
        <h1>دخول الإدارة</h1>
        <form className="form" onSubmit={go}>
          <label>
            البريد
            <input type="email" value={e} onChange={(x) => setE(x.target.value)} required />
          </label>
          <label>
            كلمة المرور
            <input type="password" value={p} onChange={(x) => setP(x.target.value)} required />
          </label>
          <button className="btn light">دخول</button>
          {m && <p>{m}</p>}
        </form>
      </div>
    </main>
  );
}
