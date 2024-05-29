import type { Metadata } from 'next';
import { NEXT_PUBLIC_NAME } from '@/configs/env.public';

export const metadata: Metadata = {
  title: NEXT_PUBLIC_NAME + ' - Home',
  description: 'Home page of ' + NEXT_PUBLIC_NAME,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
