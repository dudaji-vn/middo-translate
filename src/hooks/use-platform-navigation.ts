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
    let href = path;
    const current = new URLSearchParams(Array.from(query?.entries() || []));
    if (isMobile) {
      current.set('platform', 'mobile');
    }
    if (current.toString()) {
      href += `?${current.toString()}`;
    }
    if (option === 'replace') {
      router.replace(href);
      return;
    }
    router.push(href);
  };

  const toPlatformLink = (path: string, q?: URLSearchParams) => {
    let href = `${path}`;
    const query = new URLSearchParams(Array.from(q?.entries() || []));
    if (isMobile) {
      query.set('platform', 'mobile');
    }
    if (query.toString()) {
      href += `?${query.toString()}`;
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
