import { db } from './db';
import { z } from 'zod';

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  city: z.string().trim().min(2).max(80),
  area: z.string().trim().min(2).max(100),
  addressDetails: z.string().trim().min(5).max(300),
  notes: z.string().trim().max(500).optional(),
  paymentMethod: z.enum(['COD', 'BANK_TRANSFER', 'WALLET', 'GATEWAY']),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1).max(100),
      })
    )
    .min(1),
  idempotencyKey: z.string().min(16).max(100),
});

export async function createOrder(input: unknown) {
  const v = checkoutSchema.parse(input);
  return db.$transaction(async (tx) => {
    const existing = await tx.order.findUnique({ where: { idempotencyKey: v.idempotencyKey } });
    if (existing) return existing;

    const ids = [...new Set(v.items.map((x) => x.productId))];
    const products = await tx.product.findMany({ where: { id: { in: ids }, isPublished: true } });
    if (products.length !== ids.length) throw new Error('PRODUCT_UNAVAILABLE');

    const map = new Map(products.map((p) => [p.id, p]));
    let subtotal = 0;
    const items = v.items.map((x) => {
      const p = map.get(x.productId)!;
      if (p.stock < x.quantity) throw new Error('OUT_OF_STOCK');
      const line = p.price * x.quantity;
      subtotal += line;
      return {
        productId: p.id,
        productName: p.name,
        sku: p.sku,
        unitPrice: p.price,
        quantity: x.quantity,
        lineTotal: line,
      };
    });

    const zone = await tx.deliveryZone.findFirst({
      where: { city: v.city, area: v.area, isActive: true },
    });
    const deliveryFee = zone?.fee ?? 0;
    const total = subtotal + deliveryFee;

    for (const x of v.items) {
      const r = await tx.product.updateMany({
        where: { id: x.productId, stock: { gte: x.quantity } },
        data: { stock: { decrement: x.quantity } },
      });
      if (r.count !== 1) throw new Error('STOCK_RACE');
    }

    const number = `ZON-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const order = await tx.order.create({
      data: {
        number,
        customerName: v.customerName,
        phone: v.phone,
        city: v.city,
        area: v.area,
        addressDetails: v.addressDetails,
        notes: v.notes,
        status: 'PENDING_CONFIRMATION',
        paymentMethod: v.paymentMethod,
        subtotal,
        deliveryFee,
        total,
        idempotencyKey: v.idempotencyKey,
        items: { create: items },
        events: { create: { status: 'PENDING_CONFIRMATION', note: 'Created by checkout' } },
      },
    });
    return order;
  });
}
