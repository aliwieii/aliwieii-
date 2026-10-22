import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  const pass = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'change-me-before-deploy', 12);
  await db.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    update: { passwordHash: pass, role: 'ADMIN' },
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      passwordHash: pass,
      name: 'ZOON Admin',
      role: 'ADMIN',
    },
  });

  const cat = await db.category.upsert({
    where: { slug: 'mugs' },
    update: {},
    create: {
      slug: 'mugs',
      name: 'أكواب',
      description: 'أكواب يومية بتصاميم بسيطة',
    },
  });

  const products = [
    ['zoon-black-mug', 'ZON-MUG-001', 'كوب ZOON الأسود', 1500, '/images/source-2.jpg'],
    ['zoon-white-mug', 'ZON-MUG-002', 'كوب ZOON الأبيض', 1500, '/images/source-3.jpg'],
    ['zoon-signature-mug', 'ZON-MUG-003', 'كوب ZOON المميز', 1800, '/images/source-5.jpg'],
    ['zoon-daily-mug', 'ZON-MUG-004', 'كوب ZOON اليومي', 2000, '/images/source-4.jpg'],
  ] as const;

  for (const [slug, sku, name, price, imageUrl] of products) {
    const prod = await db.product.upsert({
      where: { sku },
      update: {},
      create: {
        slug,
        sku,
        name,
        price,
        stock: 20,
        categoryId: cat.id,
        isFeatured: slug.includes('signature'),
      },
    });
    const imgCount = await db.productImage.count({ where: { productId: prod.id } });
    if (imgCount === 0) {
      await db.productImage.create({
        data: {
          productId: prod.id,
          url: imageUrl,
          alt: name,
          sortOrder: 0,
        },
      });
    }
  }

  for (const [city, area, fee] of [
    ['صنعاء', 'أمانة العاصمة', 1000],
    ['صنعاء', 'حَدة', 1200],
  ] as const) {
    const existingZone = await db.deliveryZone.findFirst({ where: { city, area } });
    if (!existingZone) {
      await db.deliveryZone
        .create({ data: { city, area, fee, etaMinDays: 1, etaMaxDays: 3 } })
        .catch(() => {});
    }
  }
}

main().finally(() => db.$disconnect());
