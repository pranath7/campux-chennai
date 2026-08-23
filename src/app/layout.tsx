import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileGestures } from '@/components/mobile/MobileGestures';
import { BRAND_CONFIG } from '@/lib/brandConfig';

export const dynamic = 'force-dynamic';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.name} — Verified Student Academic Marketplace & College Community`,
  description: BRAND_CONFIG.shortTagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="bg-[#FAF8F5] text-[#121316] min-h-screen flex flex-col antialiased selection:bg-[#059669] selection:text-white font-sans touch-manipulation">
        <AuthProvider>
          <MobileGestures>
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </MobileGestures>
        </AuthProvider>
      </body>
    </html>
  );
}
