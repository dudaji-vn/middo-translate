'use client';

import useProtectedRoute from '@/hooks/use-protected-route';

export default function VideoCallAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useProtectedRoute();
  if (!isLoaded || !user) return null;
  return <>{children}</>;
}
