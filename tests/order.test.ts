import { describe, it, expect } from 'vitest';
import { checkoutSchema, createOrder } from '../lib/order';

describe('checkout validation', () => {
  it('rejects empty cart', () => {
    expect(() =>
      checkoutSchema.parse({
        customerName: 'AA',
        phone: '1234567',
        city: 'صنعاء',
        area: 'حدة',
        addressDetails: 'عنوان واضح',
        paymentMethod: 'COD',
        items: [],
        idempotencyKey: '1234567890123456',
      })
    ).toThrow();
  });

  it('accepts valid guest order shape', () => {
    const x = checkoutSchema.parse({
      customerName: 'عميل ZOON',
      phone: '777777777',
      city: 'صنعاء',
      area: 'حدة',
      addressDetails: 'شارع رئيسي بجوار المتجر',
      paymentMethod: 'COD',
      items: [{ productId: 'p1', quantity: 2 }],
      idempotencyKey: '1234567890123456',
    });
    expect(x.items[0].quantity).toBe(2);
  });

  it('creates order with delivery zone fee and enforces idempotency', async () => {
    const key = 'vitest-idem-key-1234567890';
    const order1 = await createOrder({
      customerName: 'أحمد محمد',
      phone: '777123456',
      city: 'صنعاء',
      area: 'أمانة العاصمة',
      addressDetails: 'شارع الزبيري بجوار جسر كنتاكي',
      paymentMethod: 'COD',
      items: [{ productId: 'prod-zoon-black-mug', quantity: 2 }],
      idempotencyKey: key,
    });
    expect(order1.subtotal).toBe(3000);
    expect(order1.deliveryFee).toBe(1000);
    expect(order1.total).toBe(4000);

    const order2 = await createOrder({
      customerName: 'أحمد محمد',
      phone: '777123456',
      city: 'صنعاء',
      area: 'أمانة العاصمة',
      addressDetails: 'شارع الزبيري بجوار جسر كنتاكي',
      paymentMethod: 'COD',
      items: [{ productId: 'prod-zoon-black-mug', quantity: 2 }],
      idempotencyKey: key,
    });
    expect(order2.id).toBe(order1.id);
  });
});
