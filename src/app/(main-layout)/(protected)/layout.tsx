import { InitializeAuthStore } from '@/features/auth/stores/client-init-store';
import { getCurrentUser } from '@/features/auth/api';
import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentUser();
  if (!profile) {
    redirect('/login');
  }
  return (
    <>
      <InitializeAuthStore user={profile} />
      {children}
    </>
  );
}
