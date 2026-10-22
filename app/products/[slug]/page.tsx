import { notFound } from 'next/navigation';
import StoreHeader from '../../../components/StoreHeader';
import { db } from '../../../lib/db';
import Link from 'next/link';
import AddToCartButton from '../../../components/AddToCartButton';

export const dynamic = 'force-dynamic';

export default async function Product({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let p: any = null;
  try {
    p = await db.product.findUnique({
      where: { slug },
      include: {
        images: true,
        category: true,
        reviews: { where: { isApproved: true }, orderBy: { createdAt: 'desc' } },
      },
    });
  } catch {}
  if (!p) notFound();

  const images =
    p.images && p.images.length > 0
      ? p.images
      : [{ id: 'default-img', url: '/images/source-2.jpg', alt: p.name }];

  return (
    <>
      <StoreHeader />
      <main className="page container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>
          <div>
            {images.map((im: any) => (
              <img
                key={im.id}
                src={im.url}
                alt={im.alt || p.name}
                style={{ width: '100%', borderRadius: 14, marginBottom: 12 }}
              />
            ))}
          </div>
          <div>
            <div className="eyebrow">{p.category?.name}</div>
            <h1>{p.name}</h1>
            <p className="muted">SKU: {p.sku}</p>
            <div className="price" style={{ fontSize: 26, margin: '20px 0' }}>
              {p.price.toLocaleString('en-US')} ر.ي
            </div>
            <p style={{ lineHeight: 2 }}>{p.description || p.shortDescription}</p>
            <p className="muted">
              {p.stock > 0 ? `متوفر — ${p.stock} قطعة` : 'غير متوفر حالياً'}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <AddToCartButton
                product={{
                  id: p.id,
                  name: p.name,
                  price: p.price,
                  sku: p.sku,
                  image: images[0]?.url,
                }}
              />
              <Link className="btn" href={`/checkout?product=${p.id}`}>
                شراء الآن
              </Link>
            </div>
            <div style={{ marginTop: 25 }}>
              <h3>التقييمات</h3>
              {p.reviews?.length ? (
                p.reviews.map((r: any) => (
                  <div key={r.id} className="panel" style={{ marginTop: 8 }}>
                    {'★'.repeat(r.rating)}
                    <br />
                    {r.comment}
                  </div>
                ))
              ) : (
                <p className="muted">لا توجد تقييمات موثقة بعد.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
