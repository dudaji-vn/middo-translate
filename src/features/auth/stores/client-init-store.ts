'use client';

import { User } from '@/features/users/types';
import useAuthStore from '@/features/auth/stores/use-auth-store';
import { useRef } from 'react';

export const InitializeAuthStore = ({ user }: { user: User }) => {
  const initialized = useRef(false);
  if (initialized.current) return null;
  useAuthStore.setState({ user, isAuthenticated: true });
  initialized.current = true;
  return null;
};
