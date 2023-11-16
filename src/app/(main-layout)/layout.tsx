import { MainLayout } from '@/components/layout/main-layout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
