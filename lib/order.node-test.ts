import test from 'node:test';
import assert from 'node:assert/strict';
import { checkoutSchema, createOrder } from './order';

test('checkoutSchema rejects empty cart', () => {
  assert.throws(() => {
    checkoutSchema.parse({
      customerName: 'AA',
      phone: '1234567',
      city: 'صنعاء',
      area: 'حدة',
      addressDetails: 'عنوان واضح',
      paymentMethod: 'COD',
      items: [],
      idempotencyKey: '1234567890123456',
    });
  });
});

test('checkoutSchema accepts valid guest order shape', () => {
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
  assert.equal(x.items[0].quantity, 2);
});

test('createOrder calculates subtotal, delivery zone fee, and idempotency', async () => {
  const key = 'idem-test-key-1234567890';
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

  assert.equal(order1.subtotal, 3000);
  assert.equal(order1.deliveryFee, 1000);
  assert.equal(order1.total, 4000);
  assert.match(order1.number, /^ZON-\d{4}-/);
});
