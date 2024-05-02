'use client';

import { Spinner } from '@/components/feedback';
import useProtectedRoute from '@/hooks/use-protected-route';
import { usePathname, useRouter } from 'next/navigation';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useProtectedRoute();
  const pathname = usePathname();
  const router = useRouter();
  if (!isLoaded || !user)
    return (
      <div className="mt-2 flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (isLoaded && user.status == 'unset' && pathname !== '/create-account') {
    router.push('/create-account');
    return;
  }
  return <>{children}</>;
}
