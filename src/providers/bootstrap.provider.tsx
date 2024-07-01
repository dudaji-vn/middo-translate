'use client';

import { useEffect } from 'react';

import { getProfileService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { useQuery } from '@tanstack/react-query';

const BootstrapProvider = () => {
  const { setData } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileService,
  });

  const user = data?.data;

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (user) {
      setData({ isAuthentication: true, user: user, isLoaded: true });
      return;
    } else {
      setData({ isAuthentication: false, user: null, isLoaded: true });
    }
  }, [user, isLoading, setData]);

  return null;
};

export default BootstrapProvider;
