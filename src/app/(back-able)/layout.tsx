import { BackLayout } from '@/components/layout/back-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BackLayout title="">{children}</BackLayout>;
}
