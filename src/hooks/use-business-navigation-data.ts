'use client';

import {
  EBusinessConversationKeys,
  PK_BUSINESS_SPACES,
} from '@/types/business.type';
import { useParams, usePathname } from 'next/navigation';
export enum EPageType {
  BUSINESS = 'business',
  HELP_DESK = 'help-desk',
  TEST_CHAT_FLOW = 'test-it-out',
}
const MAPPED_INBOX_STATUS = {
  [EBusinessConversationKeys.Conversations]: null,
  [EBusinessConversationKeys.Completed]: 'completed',
  [EBusinessConversationKeys.Archived]: 'archived',
};
export const useBusinessNavigationData = () => {
  const params = useParams();
  const pathname = usePathname();
  const isBusiness = pathname?.includes(EPageType.BUSINESS);

  const businessSlugs = params?.slugs || [];
  const isHelpDesk = pathname?.includes(EPageType.HELP_DESK);
  const isTestItOutPage = pathname?.includes(EPageType.TEST_CHAT_FLOW);
  const isOnBusinessChat =
    params?.[PK_BUSINESS_SPACES] && businessSlugs?.length > 0;
  const isOnHelpDeskChat =
    isHelpDesk && businessSlugs?.length === 2 && !pathname?.includes('/rate/');
  const isUserChattingWithGuest = isBusiness && businessSlugs?.length == 1;

  const guestId = isUserChattingWithGuest ? businessSlugs?.[0] : null;
  const anonymousId = isOnHelpDeskChat ? businessSlugs?.[1] : null;
  const businessConversationType = isBusiness
    ? params?.[PK_BUSINESS_SPACES]
    : null;
  const businessRoomId = isOnBusinessChat ? businessSlugs?.[0] : null;
  return {
    isBusiness,
    isHelpDesk,
    isOnBusinessChat,
    businessSlugs,
    isOnHelpDeskChat,
    isUserChattingWithGuest,
    guestId,
    businessRoomId,
    anonymousId,
    businessConversationType,
    isTestItOutPage,
    inboxStatus:
      MAPPED_INBOX_STATUS[
        (businessConversationType || '') as EBusinessConversationKeys
      ],
  };
};
