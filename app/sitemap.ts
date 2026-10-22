import { MetadataRoute } from 'next';
import { db } from '../lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || 'https://example.com';
  let ps: { slug: string; updatedAt: Date }[] = [];
  try {
    ps = await db.product.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
  } catch {}
  return [
    { url: base, lastModified: new Date() },
    ...ps.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
