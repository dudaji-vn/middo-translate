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
      <div className="mt-2 flex items-center justify-center h-[80%]">
        <Image src='/loading-middo.gif' alt="Loading" width={100} height={100} />
      </div>
    );

  if (isLoaded && user.status == 'unset' && pathname !== '/create-account') {
    router.push('/create-account');
    return;
  }
  return <>{children}</>;
}
