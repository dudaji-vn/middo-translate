import { MainLayout } from '@/components/layout/main-layout';
import CallVideoModalContainer from '@/features/call';
// import GlobalError from '@/app/global-error';
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
      <CallVideoModalContainer />
      {/* <GlobalError error='Error test'/> */}
    </MainLayout>
  );
}
