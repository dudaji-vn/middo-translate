'use client';

import { ROUTE_NAMES } from '@/configs/route-name';
import { useAuthStore } from '@/stores/auth.store';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useElectron } from './use-electron';

export default function useProtectedRoute() {
  const router = useRouter();
  const { user, isLoaded } = useAuthStore();
  const {isElectron} = useElectron();
  useEffect(() => {
    if (!user && isLoaded) {
      router.push(ROUTE_NAMES.SIGN_IN);
      return;
    }

    if (user && isLoaded && user.status == 'unset') {
      router.push(ROUTE_NAMES.CREATE_ACCOUNT);
      return;
    }

  }, [user, isLoaded, router, isElectron]);

  return {
    user,
    isLoaded,
  };
}
