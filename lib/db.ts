import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  fallbackStore?: ReturnType<typeof createFallbackClient>;
};

function createFallbackClient() {
  const now = new Date();
  const category = {
    id: 'cat-mugs',
    slug: 'mugs',
    name: 'أكواب',
    description: 'أكواب يومية بتصاميم بسيطة',
    imageUrl: null,
    parentId: null,
    sortOrder: 0,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  const productsData = [
    {
      id: 'prod-zoon-black-mug',
      slug: 'zoon-black-mug',
      sku: 'ZON-MUG-001',
      name: 'كوب ZOON الأسود',
      shortDescription: 'كوب سيراميك أسود مطفي بتصميم ZOON البسيط.',
      description: 'كوب يومي باللون الأسود المطفي، مصمم بعناية ليمنحك تجربة هادئة وأنيقة في كل صباح.',
      price: 1500,
      compareAtPrice: null,
      currency: 'YER',
      categoryId: category.id,
      stock: 20,
      isPublished: true,
      isFeatured: false,
      createdAt: now,
      updatedAt: now,
      images: [
        {
          id: 'img-1',
          productId: 'prod-zoon-black-mug',
          url: '/images/source-2.jpg',
          alt: 'كوب ZOON الأسود',
          sortOrder: 0,
        },
      ],
      reviews: [
        {
          id: 'rev-1',
          productId: 'prod-zoon-black-mug',
          userId: null,
          rating: 5,
          comment: 'خامة ممتازة وتصميم أنيق جدًا.',
          isApproved: true,
          createdAt: now,
        },
      ],
    },
    {
      id: 'prod-zoon-white-mug',
      slug: 'zoon-white-mug',
      sku: 'ZON-MUG-002',
      name: 'كوب ZOON الأبيض',
      shortDescription: 'كوب أبيض نقي بتفاصيل هادئة وحواف مريحة.',
      description: 'كوب ZOON الأبيض الكلاسيكي بتشطيب ناعم يناسب القهوة المختصة والشاي اليومي.',
      price: 1500,
      compareAtPrice: null,
      currency: 'YER',
      categoryId: category.id,
      stock: 20,
      isPublished: true,
      isFeatured: false,
      createdAt: now,
      updatedAt: now,
      images: [
        {
          id: 'img-2',
          productId: 'prod-zoon-white-mug',
          url: '/images/source-3.jpg',
          alt: 'كوب ZOON الأبيض',
          sortOrder: 0,
        },
      ],
      reviews: [],
    },
    {
      id: 'prod-zoon-signature-mug',
      slug: 'zoon-signature-mug',
      sku: 'ZON-MUG-003',
      name: 'كوب ZOON المميز',
      shortDescription: 'الإصدار الخاص بشعار اللانهاية من ZOON.',
      description: 'قطعة مميزة من الإصدار الأول تجمع بين التوازن البصري وجودة السيراميك العالية.',
      price: 1800,
      compareAtPrice: null,
      currency: 'YER',
      categoryId: category.id,
      stock: 20,
      isPublished: true,
      isFeatured: true,
      createdAt: now,
      updatedAt: now,
      images: [
        {
          id: 'img-3',
          productId: 'prod-zoon-signature-mug',
          url: '/images/source-5.jpg',
          alt: 'كوب ZOON المميز',
          sortOrder: 0,
        },
      ],
      reviews: [
        {
          id: 'rev-2',
          productId: 'prod-zoon-signature-mug',
          userId: null,
          rating: 5,
          comment: 'أجمل كوب اقتنيته، تغليف وجودة رائعة.',
          isApproved: true,
          createdAt: now,
        },
      ],
    },
    {
      id: 'prod-zoon-daily-mug',
      slug: 'zoon-daily-mug',
      sku: 'ZON-MUG-004',
      name: 'كوب ZOON اليومي',
      shortDescription: 'سعة أكبر للاستخدام اليومي في المكتب والمنزل.',
      description: 'كوب عملي بسعة مريحة يحافظ على حرارة المشروب ويعكس فلسفة LESS IS MORE.',
      price: 2000,
      compareAtPrice: null,
      currency: 'YER',
      categoryId: category.id,
      stock: 20,
      isPublished: true,
      isFeatured: false,
      createdAt: now,
      updatedAt: now,
      images: [
        {
          id: 'img-4',
          productId: 'prod-zoon-daily-mug',
          url: '/images/source-4.jpg',
          alt: 'كوب ZOON اليومي',
          sortOrder: 0,
        },
      ],
      reviews: [],
    },
  ];

  const deliveryZones = [
    {
      id: 'zone-1',
      city: 'صنعاء',
      area: 'أمانة العاصمة',
      fee: 1000,
      etaMinDays: 1,
      etaMaxDays: 3,
      minOrder: 0,
      isActive: true,
    },
    {
      id: 'zone-2',
      city: 'صنعاء',
      area: 'حَدة',
      fee: 1200,
      etaMinDays: 1,
      etaMaxDays: 3,
      minOrder: 0,
      isActive: true,
    },
  ];

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'change-me-before-deploy';
  const users = [
    {
      id: 'user-admin',
      email: adminEmail,
      passwordHash: bcrypt.hashSync(adminPass, 10),
      name: 'ZOON Admin',
      phone: null,
      role: 'ADMIN',
      createdAt: now,
      updatedAt: now,
    },
  ];

  const orders: any[] = [];

  const client: any = {
    product: {
      async findMany(args?: any) {
        let list = productsData.map((p) => ({
          ...p,
          category,
        }));
        const where = args?.where;
        if (where) {
          if (typeof where.isPublished === 'boolean') {
            list = list.filter((p) => p.isPublished === where.isPublished);
          }
          if (typeof where.isFeatured === 'boolean') {
            list = list.filter((p) => p.isFeatured === where.isFeatured);
          }
          if (where.id?.in) {
            const set = new Set(where.id.in);
            list = list.filter((p) => set.has(p.id));
          }
          if (Array.isArray(where.OR)) {
            list = list.filter((p) =>
              where.OR.some((cond: any) => {
                if (cond.name?.contains) {
                  return p.name.toLowerCase().includes(String(cond.name.contains).toLowerCase());
                }
                if (cond.sku?.contains) {
                  return p.sku.toLowerCase().includes(String(cond.sku.contains).toLowerCase());
                }
                if (cond.shortDescription?.contains) {
                  return (p.shortDescription || '')
                    .toLowerCase()
                    .includes(String(cond.shortDescription.contains).toLowerCase());
                }
                return false;
              })
            );
          }
        }
        if (args?.take) {
          list = list.slice(0, args.take);
        }
        return list;
      },
      async findUnique(args: any) {
        const where = args?.where || {};
        const found = productsData.find(
          (p) => (where.id && p.id === where.id) || (where.slug && p.slug === where.slug) || (where.sku && p.sku === where.sku)
        );
        if (!found) return null;
        return {
          ...found,
          category,
        };
      },
      async count() {
        return productsData.length;
      },
      async aggregate() {
        const totalStock = productsData.reduce((acc, p) => acc + p.stock, 0);
        return { _sum: { stock: totalStock } };
      },
      async updateMany(args: any) {
        const id = args?.where?.id;
        const gte = args?.where?.stock?.gte ?? 0;
        const dec = args?.data?.stock?.decrement ?? 0;
        const prod = productsData.find((p) => p.id === id && p.stock >= gte);
        if (!prod) return { count: 0 };
        prod.stock -= dec;
        return { count: 1 };
      },
    },
    deliveryZone: {
      async findFirst(args?: any) {
        const where = args?.where || {};
        return (
          deliveryZones.find(
            (z) =>
              (!where.city || z.city === where.city) &&
              (!where.area || z.area === where.area) &&
              (where.isActive === undefined || z.isActive === where.isActive)
          ) || null
        );
      },
    },
    order: {
      async findUnique(args: any) {
        const where = args?.where || {};
        return (
          orders.find(
            (o) =>
              (where.id && o.id === where.id) ||
              (where.number && o.number === where.number) ||
              (where.idempotencyKey && o.idempotencyKey === where.idempotencyKey)
          ) || null
        );
      },
      async findMany(args?: any) {
        const list = [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return args?.take ? list.slice(0, args.take) : list;
      },
      async count() {
        return orders.length;
      },
      async create(args: any) {
        const data = args.data;
        const id = `ord-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const createdOrder = {
          id,
          number: data.number,
          userId: data.userId || null,
          customerName: data.customerName,
          phone: data.phone,
          city: data.city,
          area: data.area,
          addressDetails: data.addressDetails,
          notes: data.notes || null,
          status: data.status || 'NEW',
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentStatus || 'PENDING',
          subtotal: data.subtotal,
          discount: data.discount || 0,
          deliveryFee: data.deliveryFee || 0,
          total: data.total,
          idempotencyKey: data.idempotencyKey,
          createdAt: new Date(),
          updatedAt: new Date(),
          items: (data.items?.create || []).map((item: any, idx: number) => ({
            id: `${id}-item-${idx}`,
            orderId: id,
            ...item,
          })),
          events: data.events?.create
            ? [
                {
                  id: `${id}-evt-0`,
                  orderId: id,
                  createdAt: new Date(),
                  ...data.events.create,
                },
              ]
            : [],
        };
        orders.push(createdOrder);
        return createdOrder;
      },
    },
    user: {
      async findUnique(args: any) {
        const email = args?.where?.email;
        return users.find((u) => u.email.toLowerCase() === String(email || '').toLowerCase()) || null;
      },
      async count() {
        return users.length;
      },
    },
    async $transaction(fn: (tx: any) => Promise<any>) {
      return fn(client);
    },
  };

  return client as unknown as PrismaClient;
}

const hasDatabaseUrl =
  typeof process.env.DATABASE_URL === 'string' &&
  process.env.DATABASE_URL.trim().length > 0 &&
  !process.env.DATABASE_URL.includes('USER:PASSWORD@HOST');

export const db: PrismaClient = hasDatabaseUrl
  ? (globalForPrisma.prisma ?? new PrismaClient())
  : (globalForPrisma.fallbackStore ?? createFallbackClient());

if (process.env.NODE_ENV !== 'production') {
  if (hasDatabaseUrl) {
    globalForPrisma.prisma = db;
  } else {
    globalForPrisma.fallbackStore = db;
  }
}
