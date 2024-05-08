'use client';

import { ROUTE_NAMES } from '@/configs/route-name';
import { useAuthStore } from '@/stores/auth.store';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useElectron } from './use-electron';
import { setCookieService } from '@/services/auth.service';

export default function useProtectedRoute() {
  const router = useRouter();
  const { user, isLoaded } = useAuthStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { isElectron } = useElectron();
  useEffect(() => {
    if (!user && isLoaded) {
      if (
        pathname?.includes(ROUTE_NAMES.SPACES) ||
        pathname?.includes(ROUTE_NAMES.SPACE_VERIFY)
      ) {
        const token = searchParams?.get('token');
        setCookieService([
          {
            key: 'redirect-path',
            value: pathname + (token ? `?token=${token}` : ''),
            time: 15,
          },
        ]).finally(() => {
          router.push(ROUTE_NAMES.SIGN_IN);
        });
        return;
      }
      router.push(ROUTE_NAMES.SIGN_IN);
      return;
    }

    if (user && isLoaded && user.status == 'unset' && pathname !== '/create-account') {
      router.push(ROUTE_NAMES.CREATE_ACCOUNT);
      return;
    }
  }, [user, isLoaded, router, isElectron, pathname, searchParams]);

  return {
    user,
    isLoaded,
  };
}
