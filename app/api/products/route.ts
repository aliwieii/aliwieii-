import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await db.product.findMany({
      where: { isPublished: true },
      include: { images: true, category: true },
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
