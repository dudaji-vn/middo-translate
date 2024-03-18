'use client';

import {
  EBusinessConversation,
  PK_BUSINESS_CONVERSATIONS,
  isBusinessConversation,
} from '@/types/business.type';
import { useParams, usePathname } from 'next/navigation';
export enum EPageType {
  BUSINESS = 'business',
  HELP_DESK = 'help-desk',
}
export const useBusiness = () => {
  const params = useParams();
  const pathname = usePathname();
  const isBusiness = isBusinessConversation(
    params?.[PK_BUSINESS_CONVERSATIONS],
  );

  const businessSlugs = params?.slugs || [];
  const isHelpDesk = pathname?.includes(EPageType.HELP_DESK);
  const isOnBusinessChat =
    params?.[PK_BUSINESS_CONVERSATIONS] && businessSlugs?.length > 0;
  const isOnHelpDeskChat = isHelpDesk && businessSlugs?.length === 3;
  const isUserChattingWithGuest = isBusiness && businessSlugs?.length == 2;

  const businessRoomId = isOnBusinessChat ? businessSlugs?.[0] : null;
  const guestId = isUserChattingWithGuest ? businessSlugs?.[1] : null;
  const anonymousId = isOnHelpDeskChat ? businessSlugs?.[2] : null;
  const businessConversationType = isBusiness
    ?businessSlugs[1]
    : (null as EBusinessConversation | null);

  return {
    isBusiness,
    isHelpDesk,
    isOnBusinessChat,
    businessSlugs,
    isOnHelpDeskChat,
    isUserChattingWithGuest,
    businessRoomId,
    guestId,
    anonymousId,
    businessConversationType,
  };
};
