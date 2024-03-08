'use client';
import useProtectedRoute from '@/hooks/use-protected-route';
import { usePathname, useRouter } from 'next/navigation';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useProtectedRoute();
  const pathname = usePathname()
  const router = useRouter();
  if (!isLoaded || !user) return null;
  
  if(isLoaded && user.status == 'unset' && pathname !== '/create-account') {
    router.push('/create-account');
    return;
  }
  return <>{children}</>;
}
