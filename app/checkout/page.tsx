'use client';
import StoreHeader from '../../components/StoreHeader';
import Link from 'next/link';
import { useState } from 'react';

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [orderNum, setOrderNum] = useState('');

  async function submit(e: any) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setOrderNum('');

    let items: any[] = [];
    try {
      items = JSON.parse(localStorage.getItem('zoon-cart') || '[]');
    } catch {}

    if (!items.length && typeof window !== 'undefined') {
      const directProductId = new URLSearchParams(window.location.search).get('product');
      if (directProductId) {
        items = [{ id: directProductId, quantity: 1 }];
      }
    }

    if (!items.length) {
      setLoading(false);
      setMsg('السلة فارغة. أضف منتجًا أولًا.');
      return;
    }

    const body = {
      ...Object.fromEntries(new FormData(e.currentTarget)),
      items: items.map((x) => ({ productId: x.id, quantity: Number(x.quantity) })),
      idempotencyKey: crypto.randomUUID(),
    };

    const r = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const j = await r.json();
    setLoading(false);
    if (r.ok) {
      localStorage.removeItem('zoon-cart');
      window.dispatchEvent(new Event('zoon-cart-updated'));
      setOrderNum(j.number);
      setMsg(`تم حفظ الطلب رقم ${j.number}`);
    } else {
      setMsg(j.error || 'تعذر إنشاء الطلب.');
    }
  }

  return (
    <>
      <StoreHeader />
      <main className="page container">
        <h1>إتمام الطلب</h1>
        <p className="muted">الأسعار والمخزون والتوصيل يعاد التحقق منها على الخادم عند التأكيد.</p>
        <form className="form" onSubmit={submit}>
          <label>
            الاسم
            <input name="customerName" required />
          </label>
          <label>
            رقم الهاتف
            <input name="phone" required />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label>
              المحافظة / المدينة
              <input name="city" required />
            </label>
            <label>
              المنطقة
              <input name="area" required />
            </label>
          </div>
          <label>
            العنوان التفصيلي
            <textarea name="addressDetails" required />
          </label>
          <label>
            طريقة الدفع
            <select name="paymentMethod" defaultValue="COD">
              <option value="COD">الدفع عند الاستلام</option>
              <option value="BANK_TRANSFER">تحويل بنكي</option>
              <option value="WALLET">محفظة إلكترونية</option>
              <option value="GATEWAY">بوابة دفع (تُفعل عند إعدادها)</option>
            </select>
          </label>
          <label>
            ملاحظات
            <textarea name="notes" />
          </label>
          <button className="btn light" disabled={loading}>
            {loading ? 'جارٍ الحفظ…' : 'تأكيد الطلب'}
          </button>
          {msg && (
            <div className="panel">
              <div>{msg}</div>
              {orderNum && (
                <div style={{ marginTop: 10 }}>
                  <Link className="btn" href={`/order/${orderNum}`}>
                    عرض تفاصيل الطلب ↗
                  </Link>
                </div>
              )}
            </div>
          )}
        </form>
      </main>
    </>
  );
}
