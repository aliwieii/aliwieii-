'use client';
import StoreHeader from '../../components/StoreHeader';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Cart() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem('zoon-cart') || '[]'));
    } catch {}
  }, []);

  function updateQuantity(index: number, delta: number) {
    const next = [...items];
    next[index].quantity = Math.max(0, Math.min(99, (Number(next[index].quantity) || 1) + delta));
    const filtered = next.filter((x) => x.quantity > 0);
    setItems(filtered);
    localStorage.setItem('zoon-cart', JSON.stringify(filtered));
    window.dispatchEvent(new Event('zoon-cart-updated'));
  }

  const total = items.reduce((sum, x) => sum + Number(x.price) * Number(x.quantity), 0);

  return (
    <>
      <StoreHeader />
      <main className="page container">
        <h1>سلة المشتريات</h1>
        {!items.length ? (
          <div className="panel">
            السلة فارغة. <Link href="/products">تصفح المنتجات ↗</Link>
          </div>
        ) : (
          <div className="panel">
            {items.map((x, i) => (
              <div
                key={i}
                style={{
                  padding: 12,
                  borderBottom: '1px solid #333',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  {x.name} × {x.quantity} — {(x.price * x.quantity).toLocaleString('en-US')} ر.ي
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="btn"
                    style={{ padding: '4px 10px' }}
                    onClick={() => updateQuantity(i, 1)}
                    aria-label={`زيادة كمية ${x.name}`}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="btn"
                    style={{ padding: '4px 10px' }}
                    onClick={() => updateQuantity(i, -1)}
                    aria-label={`إنقاص كمية ${x.name}`}
                  >
                    -
                  </button>
                </div>
              </div>
            ))}
            <div style={{ padding: '16px 12px 0', fontWeight: 700 }}>
              المجموع الفرعي: {total.toLocaleString('en-US')} ر.ي
            </div>
            <Link className="btn light" href="/checkout" style={{ marginTop: 20 }}>
              إتمام الطلب
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
