import type { Metadata } from 'next';
import { Geist, Inter } from 'next/font/google';
import I18nProvider from '@/i18n/I18nProvider';
import QueryProvider from '@/components/providers/QueryProvider';
import './globals.css';
import '@/i18n/config';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Good Boy',
  description: 'Help lonely dogs find their way home.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable}${geistSans.variable}`}>
        <QueryProvider>
          <I18nProvider>{children}</I18nProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
