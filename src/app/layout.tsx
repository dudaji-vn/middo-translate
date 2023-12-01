import './globals.css';

import {
  NEXT_PUBLIC_DESCRIPTION,
  NEXT_PUBLIC_NAME,
  NEXT_PUBLIC_URL,
} from '@/configs/env.public';

import { AppProvider } from '@/providers/app';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(NEXT_PUBLIC_URL),
  title: NEXT_PUBLIC_NAME,
  description: NEXT_PUBLIC_DESCRIPTION,
  keywords: 'middo, middo translate, tranlaste, english, vietnamese, korean',
  openGraph: {
    images: ['/opengraph-image.png'],
    title: NEXT_PUBLIC_NAME,
    description: NEXT_PUBLIC_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={montserrat.className} suppressHydrationWarning={true}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
