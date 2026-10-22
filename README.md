# ZOON Store

تحويل مشروع `ZOON_Store_OneFile.html` من متجر محلي داخل المتصفح إلى أساس متجر حقيقي قابل للتوسع، مع الحفاظ على هوية ZOON السوداء/البيضاء وRTL.

## ما تم فحصه
الملف الأصلي عبارة عن HTML واحد بحجم يقارب 6.4MB، ويضم CSS وواجهة وصفحة منتجات وسلة مبنية على `localStorage`، مع تصدير/استيراد JSON وإضافة منتجات/تصنيفات من المتصفح وإرسال استفسار واتساب. لا توجد فيه قاعدة بيانات أو خادم أو مصادقة أو Checkout حقيقي.

## التقنية
- Next.js App Router + TypeScript
- PostgreSQL + Prisma
- Zod للتحقق من مدخلات Checkout
- جلسة إدارة موقعة بـ JWT داخل HttpOnly cookie
- معاملات Prisma للخصم الذري من المخزون
- Idempotency key لمنع إنشاء الطلب مرتين

## التشغيل المحلي
1. ثبّت Node.js 20+ وPostgreSQL.
2. انسخ `.env.example` إلى `.env` وغيّر القيم.
3. `npm install`
4. `npm run db:push`
5. `npm run db:seed`
6. `npm run dev`
7. افتح `/` و`/admin`.

## النشر على GitHub وVercel
1. ارفع المشروع إلى مستودع GitHub (مع التأكد من عدم رفع `.env`).
2. أنشئ قاعدة بيانات PostgreSQL (مثل Neon أو Supabase أو Vercel Postgres).
3. في إعدادات مشروع Vercel (`Settings -> Environment Variables`)، أضف:
   - `DATABASE_URL`
   - `SESSION_SECRET` (سلسلة عشوائية لا تقل عن 32 حرفًا)
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_STORE_NAME="ZOON"`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER="967779482055"`
   - `NEXT_PUBLIC_CURRENCY="YER"`
   - `NEXT_PUBLIC_SITE_URL="https://your-project.vercel.app"`
4. نفّذ تهيئة الجداول والبيانات الأولية على قاعدة البيانات:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

## ملاحظات مهمة
- بيانات الدفع الإلكتروني غير مفعلة حتى يتم إعداد مزود دفع حقيقي. لا يوجد ادعاء نجاح دفع من المتصفح.
- بيانات المناطق يجب إدخالها من لوحة الإدارة/قاعدة البيانات قبل الاعتماد التجاري.
- الصور الأصلية في النسخة القديمة كانت Data URI ضخمة داخل HTML. تم فصل عينات الصور إلى `public/images` كبداية، ويُفضّل نقل الإنتاج إلى object storage/CDN وتحويلها إلى WebP/AVIF.
- لا توجد أسرار حقيقية في المستودع.

## الاختبارات
`npm test` يشغّل اختبارات تحقق نموذج Checkout.
