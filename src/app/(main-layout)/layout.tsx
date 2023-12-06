import { MainLayout } from '@/components/layout/main-layout';
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
