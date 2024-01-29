'use client';
import { deleteFCMToken } from '@/lib/firebase';
import { useEffect } from 'react';
import { useNotificationStore } from '../store';
import { signOutService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import toast from 'react-hot-toast';

export const SignOutSideEffect = () => {
  const { setData: setDataAuth } = useAuthStore();

  const resetNotification = useNotificationStore((state) => state.reset);

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await signOutService();
        setDataAuth({ user: null, isAuthentication: false });
        deleteFCMToken();
        resetNotification('');
        toast.success('Sign out success!');
      } catch (err: any) {
        toast.error(err?.response?.data?.message);
      }
    };
    handleSignOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
};
