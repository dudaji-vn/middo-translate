'use client';

import { useEffect } from 'react';

import { getCookieService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { LOGIN_FROM_DESKTOP } from '@/configs/store-key';

export default function LoginGoogleElectron() {
  const router = useRouter();
  useEffect(() => {
    let isLoginFromDesktop = localStorage.getItem(LOGIN_FROM_DESKTOP);
    if (!isLoginFromDesktop) {
      localStorage.setItem(LOGIN_FROM_DESKTOP, 'true');
      router.push('/api/auth/google');
    } else {
      getCookieService()
        .then((res) => {
          const { data } = res;
          const { accessToken, refreshToken } = data;
          if (accessToken && refreshToken) {
            localStorage.removeItem(LOGIN_FROM_DESKTOP);
            window.location.href = `middo://token?token=${accessToken}&refresh_token=${refreshToken}`;
            router.push('/talk');
          }
        })
        .catch((err) => console.log(err));
    }
  }, [router]);

  return null;
}
