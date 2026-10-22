import Link from 'next/link';
import StoreHeader from '../components/StoreHeader';
import ProductCard from '../components/ProductCard';
import { db } from '../lib/db';

export const dynamic = 'force-dynamic';

async function products() {
  return db.product.findMany({
    where: { isPublished: true },
    include: { images: true, category: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });
}

export default async function Home() {
  let ps: any[] = [];
  try {
    ps = await products();
  } catch {}
  return (
    <>
      <StoreHeader />
      <main>
        <section className="hero">
          <img src="/images/source-0.png" alt="ZOON" />
          <div className="container hero-content">
            <div className="eyebrow">ZOON / LESS IS MORE</div>
            <h1>
              بساطة تلفت.
              <br />
              وشخصية تُعبّر.
            </h1>
            <p>قطع مختارة بعناية، بتصميم نظيف وتفاصيل تصنع الفرق.</p>
            <Link className="btn light" href="/products">
              تسوّق الآن ↗
            </Link>
          </div>
        </section>
        <div className="features">
          <div className="feature">
            اختيارات مدروسة
            <br />
            <small className="muted">تصميم بسيط وجودة واضحة</small>
          </div>
          <div className="feature">
            توصيل محلي
            <br />
            <small className="muted">رسوم حسب المنطقة</small>
          </div>
          <div className="feature">
            شراء كضيف
            <br />
            <small className="muted">لا تحتاج إلى إنشاء حساب</small>
          </div>
        </div>
        <section className="section container">
          <div className="section-head">
            <div>
              <div className="eyebrow">THE FIRST EDIT / 001</div>
              <h2>اختياراتنا الأولى</h2>
            </div>
            <Link className="muted" href="/products">
              عرض الكل ↗
            </Link>
          </div>
          <div className="grid4">
            {ps.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
            {!ps.length && (
              <p className="muted">
                لا توجد منتجات منشورة بعد. شغّل seed ثم أضف الصور من لوحة الإدارة.
              </p>
            )}
          </div>
        </section>
        <section id="about" className="section container">
          <div className="section-head">
            <div>
              <div className="eyebrow">LESS, BUT BETTER</div>
              <h2>عن ZOON</h2>
            </div>
          </div>
          <p className="muted" style={{ maxWidth: 700, lineHeight: 2 }}>
            ZOON تبني تجربة شراء هادئة وواضحة: منتجات مختارة، معلومات صريحة، وسلة وطلب حقيقيان بدل
            الاعتماد على بيانات المتصفح فقط.
          </p>
        </section>
      </main>
      <footer className="footer container">
        <div>
          <b>ZOON</b>
          <p className="muted">LESS IS MORE</p>
        </div>
        <div>
          <b>روابط</b>
          <p>
            <Link href="/products">المنتجات</Link>
          </p>
          <p>
            <Link href="/#about">من نحن</Link>
          </p>
        </div>
        <div>
          <b>مساعدة</b>
          <p>
            <Link href="/cart">سلة المشتريات</Link>
          </p>
          <p>
            <Link href="/admin">لوحة الإدارة</Link>
          </p>
        </div>
        <div className="footer-note">© 2026 ZOON. جميع الحقوق محفوظة.</div>
      </footer>
    </>
  );
}
