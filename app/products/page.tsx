import StoreHeader from '../../components/StoreHeader';
import ProductCard from '../../components/ProductCard';
import { db } from '../../lib/db';

export const dynamic = 'force-dynamic';

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; featured?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim();
  const featured = sp.featured === '1';

  let products: any[] = [];
  try {
    products = await db.product.findMany({
      where: {
        isPublished: true,
        ...(featured ? { isFeatured: true } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { sku: { contains: q, mode: 'insensitive' } },
                { shortDescription: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: { images: true, category: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch {}

  return (
    <>
      <StoreHeader />
      <main className="page container">
        <div className="section-head">
          <div>
            <div className="eyebrow">ZOON / PRODUCTS</div>
            <h1>{featured ? 'المنتجات المميزة' : 'كل المنتجات'}</h1>
          </div>
          <p className="muted">{products.length} منتج</p>
        </div>
        <div className="grid4">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
        {!products.length && <div className="panel">لا توجد نتائج مطابقة.</div>}
      </main>
    </>
  );
}
