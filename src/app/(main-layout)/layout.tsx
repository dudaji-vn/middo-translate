import { MainLayout } from '@/components/layout/main-layout';
import CallVideoModalContainer from '@/features/call/components';
// import GlobalError from '@/app/global-error';
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const profile = await getCurrentUser();
  return (
    <MainLayout>
      {/* <GlobalError error='Error test'/> */}
      {/* <InitializeAuthStore user={profile as User} /> */}
      {children}
      <CallVideoModalContainer />
    </MainLayout>
  );
}
