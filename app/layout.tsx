import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ZOON — LESS IS MORE',
  description: 'ZOON متجر بسيط وفاخر للمنتجات المختارة.',
  openGraph: {
    title: 'ZOON — LESS IS MORE',
    description: 'ZOON متجر بسيط وفاخر للمنتجات المختارة.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
