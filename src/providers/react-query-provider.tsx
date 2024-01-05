'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useState } from 'react';

export interface ReactQueryProviderProps {
  children: React.ReactNode;
}
const config = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
};

export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: config }),
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
