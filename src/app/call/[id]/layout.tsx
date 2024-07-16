'use client';

import { getAnonymousCallInformation } from '@/services/video-call.service';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const callId = params?.id;
  useEffect(() => {
    if (!callId) notFound();
    const getCallById = async () => {
        if(typeof callId != 'string') return;
        try {
            await getAnonymousCallInformation(callId)
        } catch (_) {
            notFound();
        }
    }
    getCallById()

  }, [callId]);

  return <>{children}</>;
}
