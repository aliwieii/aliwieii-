'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function StoreHeader() {
  const [q, setQ] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function syncCart() {
      try {
        const raw = localStorage.getItem('zoon-cart');
        const items: any[] = raw ? JSON.parse(raw) : [];
        const count = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    }
    syncCart();
    window.addEventListener('storage', syncCart);
    window.addEventListener('zoon-cart-updated', syncCart);
    return () => {
      window.removeEventListener('storage', syncCart);
      window.removeEventListener('zoon-cart-updated', syncCart);
    };
  }, []);

  return (
    <>
      <header className="topbar">
        <button
          type="button"
          className="icon mobile"
          aria-label="القائمة"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          ☰
        </button>
        <Link className="logo" href="/">
          <span>Z</span>
          <span className="inf">∞</span>
          <span>ON</span>
          <small>LESS IS MORE</small>
        </Link>
        <nav className="nav">
          <Link href="/">الرئيسية</Link>
          <Link href="/products">المنتجات</Link>
          <Link href="/products?featured=1">المميزة</Link>
          <Link href="/#about">من نحن</Link>
        </nav>
        <div className="actions">
          <form className="search" action="/products">
            <span>⌕</span>
            <input
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن منتج..."
            />
          </form>
          <Link className="icon" href="/cart" aria-label="السلة">
            ♧<b className="badge">{cartCount}</b>
          </Link>
        </div>
      </header>
      {menuOpen && (
        <nav
          aria-label="قائمة الجوال"
          style={{
            background: '#111315',
            borderBottom: '1px solid #26282b',
            padding: '14px 4%',
            display: 'flex',
            gap: 18,
            flexWrap: 'wrap',
            fontSize: 13,
          }}
        >
          <Link href="/" onClick={() => setMenuOpen(false)}>
            الرئيسية
          </Link>
          <Link href="/products" onClick={() => setMenuOpen(false)}>
            المنتجات
          </Link>
          <Link href="/products?featured=1" onClick={() => setMenuOpen(false)}>
            المميزة
          </Link>
          <Link href="/#about" onClick={() => setMenuOpen(false)}>
            من نحن
          </Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)}>
            السلة ({cartCount})
          </Link>
        </nav>
      )}
    </>
  );
}
