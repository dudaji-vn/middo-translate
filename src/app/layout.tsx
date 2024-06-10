import './globals.css';

import {
  NEXT_PUBLIC_DESCRIPTION,
  NEXT_PUBLIC_NAME,
  NEXT_PUBLIC_URL,
} from '@/configs/env.public';

import { AppProvider } from '@/providers/app.provider';
import { cn } from '@/utils/cn';
import type { Metadata, Viewport } from 'next';
import { Open_Sans } from 'next/font/google';

const font = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(NEXT_PUBLIC_URL),
  title: {
    default: NEXT_PUBLIC_NAME,
    template: '%s | ' + NEXT_PUBLIC_NAME,
  },
  description: NEXT_PUBLIC_DESCRIPTION,
  keywords: 'middo, middo translate, tranlaste, english, vietnamese, korean',
  twitter: {
    card: 'summary',
    site: '@middo',
  },
  verification: {
    google: '93nxwzFXGw9SFXutb6FCgeqV5Pz9rL9MTxCRxzJwDKM',
  },
};

export const viewport: Viewport = {
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={cn(font.className, 'bg-transparent')}
        suppressHydrationWarning={true}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
