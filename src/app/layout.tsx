import './globals.css';

import {
  NEXT_PUBLIC_DESCRIPTION,
  NEXT_PUBLIC_NAME,
} from '@/configs/env.public';

import { AppProvider } from '@/providers/app';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: NEXT_PUBLIC_NAME,
  description: NEXT_PUBLIC_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
