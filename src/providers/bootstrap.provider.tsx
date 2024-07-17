'use client';

import { useEffect } from 'react';

import { getProfileService, signOutService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { User } from '@/features/users/types';

const BootstrapProvider = () => {
  const { setData } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileService,
  });

  const user: User = data?.data;

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (user && user.status == 'anonymous') {
      signOutService();
    } else if (user) {
      setData({ isAuthentication: true, user: user, isLoaded: true });
      return;
    }
    setData({ isAuthentication: false, user: null, isLoaded: true });
  }, [user, isLoading, setData]);

  return null;
};

export default BootstrapProvider;
