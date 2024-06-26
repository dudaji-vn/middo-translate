'use client';

import { usePlatformStore } from '@/features/platform/stores';
import { useRouter } from 'next/navigation';

export default function usePlatformNavigation() {
  const isMobile = usePlatformStore((state) => state.platform) === 'mobile';

  const router = useRouter();

  const navigateTo = (
    path: string,
    query?: URLSearchParams,
    option: 'push' | 'replace' = 'push',
  ) => {
    const current = new URLSearchParams(Array.from(query?.entries() || []));
    if (isMobile) {
      current.set('platform', 'mobile');
    }
    const href = `${path}?${current.toString()}`;
    if (option === 'replace') {
      router.replace(href);
      return;
    }
    router.push(href);
  };

  const toPlatformLink = (path: string, query?: URLSearchParams) => {
    let href = `${path}?platform=mobile`;
    if (isMobile && query) {
      query.set('platform', 'mobile');
      href = `${path}?${query.toString()}`;
    }
    return href as string;
  };

  return {
    navigateTo,
    toPlatformLink,
    router,
    isMobile,
  };
}
