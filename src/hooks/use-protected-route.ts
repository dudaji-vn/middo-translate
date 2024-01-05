'use client';

import { ROUTE_NAMES } from '@/configs/route-name';
import { useAuthStore } from '@/stores/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function useProtectedRoute() {
  const router = useRouter();
  const { user, isLoaded } = useAuthStore();
  useEffect(() => {
    if (!user && isLoaded) {
      router.push(ROUTE_NAMES.SIGN_IN);
      return;
    }
    
    if (user && isLoaded && (user.status == 'unset')) {
      router.push(ROUTE_NAMES.CREATE_ACCOUNT);
      return;
    }
  }, [user, isLoaded, router]);

  return {
    user,
    isLoaded,
  }
}
