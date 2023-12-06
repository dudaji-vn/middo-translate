'use client';

import { ROUTE_NAMES } from '@/configs/route-name';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoaded } = useAuthStore();
  useEffect(() => {
    if(!user && isLoaded) {
      router.push(ROUTE_NAMES.SIGN_IN);
      return;
    }

    if(user && isLoaded && !user.avatar && !user.name && !user.language) {
      router.push(ROUTE_NAMES.CREATE_ACCOUNT);
      return;
    }
    
  }, [user, isLoaded, router]);

  if(!isLoaded) return null;

  return <>{children}</>;
}
