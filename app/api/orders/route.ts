import { NextResponse } from 'next/server';
import { createOrder } from '../../../lib/order';

export async function POST(req: Request) {
  try {
    const o = await createOrder(await req.json());
    return NextResponse.json({ id: o.id, number: o.number, total: o.total }, { status: 201 });
  } catch (e: any) {
    const map: any = {
      OUT_OF_STOCK: 'OUT_OF_STOCK',
      PRODUCT_UNAVAILABLE: 'PRODUCT_UNAVAILABLE',
      STOCK_RACE: 'OUT_OF_STOCK',
    };
    return NextResponse.json({ error: map[e?.message] || 'INVALID_ORDER' }, { status: 400 });
  }
}
