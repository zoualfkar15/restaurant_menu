import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { LocaleProvider } from '@/lib/locale';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });

export const metadata: Metadata = {
  title: 'MenuQR — Digital Menus for Restaurants',
  description: 'QR-based digital menus for restaurants, cafés, and cafeterias. Let customers scan and browse your menu online.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={dmSans.variable} suppressHydrationWarning>
      <body className="min-h-screen antialiased font-sans">
        <LocaleProvider defaultLocale="ar" enabledLocales={['en', 'ar']} currency="USD">
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
