'use client';

import { Spinner } from '@/components/feedback';
import useProtectedRoute from '@/hooks/use-protected-route';
import Image from 'next/image';
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
      <div className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center dark:bg-neutral-900/90">
        <Image
          src="/loading-middo.gif"
          alt="Loading"
          width={100}
          height={100}
          priority
        />
      </div>
    );

  if (isLoaded && user.status == 'unset' && pathname !== '/create-account') {
    router.push('/create-account');
    return;
  }
  if (user.status == 'deleted' && pathname !== '/account-deleted') {
    router.push('/account-deleted');
    return;
  }
  return <>{children}</>;
}
