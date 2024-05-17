'use client';

import { PageLoading } from '@/components/feedback';
import {
  LSK_VISITOR_DATA,
  LSK_VISITOR_ID,
  LSK_VISITOR_ROOM_ID,
} from '@/types/business.type';
import { useRouter } from 'next/navigation';
import React, { use, useEffect } from 'react';

const ExpiredRoom = ({ redirectPath }: { redirectPath: string }) => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem(LSK_VISITOR_DATA);
    localStorage.removeItem(LSK_VISITOR_ID);
    localStorage.removeItem(LSK_VISITOR_ROOM_ID);
    router.push(redirectPath);
  }, [redirectPath]);

  return <PageLoading />;
};

export default ExpiredRoom;
