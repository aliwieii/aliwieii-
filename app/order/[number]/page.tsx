import { db } from '../../../lib/db';
import { notFound } from 'next/navigation';
import StoreHeader from '../../../components/StoreHeader';

export const dynamic = 'force-dynamic';

export default async function Order({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  let o: any = null;
  try {
    o = await db.order.findUnique({
      where: { number },
      include: { items: true, events: { orderBy: { createdAt: 'asc' } } },
    });
  } catch {}
  if (!o) notFound();

  return (
    <>
      <StoreHeader />
      <main className="page container">
        <div className="eyebrow">ORDER TRACKING</div>
        <h1>{o.number}</h1>
        <div className="panel">
          <p>الحالة: {o.status}</p>
          <p>الإجمالي: {o.total.toLocaleString('en-US')} ر.ي</p>
          {o.items.map((i: any) => (
            <div key={i.id}>
              {i.productName} × {i.quantity}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
