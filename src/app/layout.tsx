import './globals.css';

import { PUBLIC_APP_DESCRIPTION, PUBLIC_APP_NAME } from '@/configs/env.public';

import { AppProvider } from '@/providers/app';
import { MainLayout } from '@/components/layout/main-layout';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: PUBLIC_APP_NAME,
  description: PUBLIC_APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <AppProvider>
          <MainLayout>{children}</MainLayout>
        </AppProvider>
      </body>
    </html>
  );
}
