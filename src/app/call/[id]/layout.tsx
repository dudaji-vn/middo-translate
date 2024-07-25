'use client';

import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { getAnonymousCallInformation } from '@/services/video-call.service';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const callId = params?.id;
  const router = useRouter();
  const [isValidUrl, setIsValidUrl] = useState(false);
  useEffect(() => {
    if (!callId) {
      router.push('/404')
      return;
    };
    const getCallById = async () => {
        if(typeof callId != 'string') return;
        try {
          const res = await getAnonymousCallInformation(callId)
          if(!res.data) {
            router.push('/404');
          } else {
            setIsValidUrl(true)
          }
        } catch (_) {
          router.push('/404');
        }
    }
    getCallById()
  }, [callId]);
  if(!isValidUrl) return null;
  return <>{children}</>;
}
