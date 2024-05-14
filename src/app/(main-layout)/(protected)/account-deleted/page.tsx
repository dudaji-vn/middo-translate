'use client';

import { useNotificationStore } from '@/features/notification/store';
import { signOutService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountDeleted() {
  const { user, setData } = useAuthStore();
  const router = useRouter();
  const resetNotification = useNotificationStore((state) => state.reset);
  useEffect(() => {
    if (user?.status !== 'deleted') return;
    const handleLogout = async () => {
      await signOutService();
      setData({ user: null, isAuthentication: false });
      resetNotification();
      const { deleteFCMToken } = await import('@/lib/firebase');
      await deleteFCMToken();
      router.push('/sign-in');
    };
    handleLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.status]);
  return <></>;
}
