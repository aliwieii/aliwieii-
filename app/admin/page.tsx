import { db } from '../../lib/db';
import { cookies } from 'next/headers';
import { verifySession } from '../../lib/security';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Admin() {
  const c = await cookies();
  const s = c.get('zoon_session')?.value;
  const session = s ? await verifySession(s) : null;
  if (!session || session.role !== 'ADMIN') redirect('/admin/login');

  const [orders, products, users, stockAgg, recentOrders] = await Promise.all([
    db.order.count(),
    db.product.count(),
    db.user.count(),
    db.product.aggregate({ _sum: { stock: true } }).then((x) => x._sum.stock || 0),
    db.order.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
  ]);

  return (
    <main className="page container">
      <div className="eyebrow">ZOON ADMIN</div>
      <h1>لوحة التحكم</h1>
      <div className="grid4">
        <div className="panel">
          الطلبات
          <br />
          <strong>{orders}</strong>
        </div>
        <div className="panel">
          المنتجات
          <br />
          <strong>{products}</strong>
        </div>
        <div className="panel">
          العملاء
          <br />
          <strong>{users}</strong>
        </div>
        <div className="panel">
          المخزون
          <br />
          <strong>{stockAgg}</strong>
        </div>
      </div>
      <section className="section">
        <h2>آخر الطلبات</h2>
        <div className="panel">
          <table className="table">
            <thead>
              <tr>
                <th>الطلب</th>
                <th>العميل</th>
                <th>الإجمالي</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>{o.number}</td>
                  <td>{o.customerName}</td>
                  <td>{o.total.toLocaleString('en-US')} ر.ي</td>
                  <td>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
