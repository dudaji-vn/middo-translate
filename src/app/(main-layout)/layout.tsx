import { InitializeAuthStore } from '@/features/auth/stores/client-init-store';
import { MainLayout } from '@/components/layout/main-layout';
import { User } from '@/features/users/types';
import { getCurrentUser } from '@/features/auth/api';
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const profile = await getCurrentUser();
  return (
    <MainLayout>
      {/* <InitializeAuthStore user={profile as User} /> */}
      {children}
    </MainLayout>
  );
}
