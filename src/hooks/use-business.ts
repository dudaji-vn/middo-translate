'use client';

import { PK_BUSINESS_CONVERSATIONS, isBusinessConversation } from '@/types/business.type';
import { useParams, usePathname } from 'next/navigation';
export enum EPageType {
  BUSINESS = 'business',
  HELP_DESK = 'help-desk',
}
export const useBusiness = () => {
  const params = useParams();
  const pathname = usePathname();
  const isBusiness = isBusinessConversation(params?.[PK_BUSINESS_CONVERSATIONS]);
  const isHelpDesk = pathname?.includes(EPageType.HELP_DESK);
  const isOnBusinessChat = params?.[PK_BUSINESS_CONVERSATIONS] && params?.['slugs']?.length > 0;

  return {
    isBusiness,
    isHelpDesk,
    isOnBusinessChat,
  };
};
