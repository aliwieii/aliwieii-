'use client';
import { useState } from 'react';

export default function AddToCartButton({
  product,
}: {
  product: { id: string; name: string; price: number; sku: string; image?: string };
}) {
  const [done, setDone] = useState(false);

  function add() {
    const raw = localStorage.getItem('zoon-cart');
    let cart: any[] = [];
    try {
      cart = raw ? JSON.parse(raw) : [];
    } catch {}
    const found = cart.find((x) => x.id === product.id);
    if (found) found.quantity = Math.min(found.quantity + 1, 99);
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem('zoon-cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('zoon-cart-updated'));
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  }

  return (
    <button className="btn light" onClick={add}>
      {done ? 'تمت الإضافة ✓' : 'أضف إلى السلة'}
    </button>
  );
}
