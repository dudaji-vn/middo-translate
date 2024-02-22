import { MainLayout } from '@/components/layout/main-layout';
import CallVideoModalContainer from '@/features/call';
import ShortcutsGuide from '@/features/shortcut/shortcut-guide';
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
      <ShortcutsGuide />
      <CallVideoModalContainer />??
      {/* <GlobalError error='Error test'/> */}
    </MainLayout>
  );
}
