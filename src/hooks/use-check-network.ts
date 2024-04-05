import { useNetworkStatus } from '@/utils/use-network-status';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
type Status = 'ONLINE' | 'OFFLINE' | undefined;
export default function useCheckNetwork() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>();
  const pathname = usePathname();

  const { isOnline } = useNetworkStatus();
  useEffect(() => {
    if (isOnline && status == 'OFFLINE') {
      setStatus('ONLINE');
    }
    if (!isOnline) {
      setStatus('OFFLINE');
    }
  }, [isOnline, status]);
  
  useEffect(()=>{
    if (status === 'OFFLINE' && pathname !== '/offline') {
      const pathNameEncoded = encodeURIComponent(pathname || '/');
      router.push('/offline?redirect=' + pathNameEncoded);
    }
    if (isOnline && pathname === '/offline') {
      const redirect = new URLSearchParams(window.location.search).get('redirect');
      router.push(redirect || '/');
    }
  }, [pathname, router, status, isOnline])
}
