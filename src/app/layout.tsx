import './globals.css';

import {
  NEXT_PUBLIC_DESCRIPTION,
  NEXT_PUBLIC_NAME,
} from '@/configs/env.public';

import { AppProvider } from '@/providers/app';
import { InitializeSessionStore } from '@/stores/initial-session';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { useSessionStore } from '@/stores/session';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: NEXT_PUBLIC_NAME,
  description: NEXT_PUBLIC_DESCRIPTION,
  openGraph: {
    images: ['https://i.postimg.cc/8c3sTD9v/fadshjsdkfhasdjk.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionId = generateSessionId();
  useSessionStore.setState({ sessionId });
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <InitializeSessionStore sessionId={sessionId} />
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

const generateSessionId = () => {
  const sessionId = Math.random().toString(36).substring(2, 15);
  return sessionId;
};
