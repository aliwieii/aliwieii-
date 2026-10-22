import Link from 'next/link';

export default function ProductCard({ p }: { p: any }) {
  const img = p.images?.[0]?.url || '/images/source-2.jpg';
  return (
    <article className="card">
      <Link href={`/products/${p.slug}`}>
        <img src={img} alt={p.images?.[0]?.alt || p.name} loading="lazy" />
      </Link>
      <div className="card-body">
        <h3>
          <Link href={`/products/${p.slug}`}>{p.name}</Link>
        </h3>
        <p className="muted">{p.shortDescription || 'تفاصيل بسيطة، تصنع الفرق.'}</p>
        <div className="price">{p.price.toLocaleString('en-US')} ر.ي</div>
        <Link className="btn" href={`/products/${p.slug}`}>
          عرض المنتج
        </Link>
      </div>
    </article>
  );
}
