'use client';

import {
  EBusinessConversationKeys,
  PK_EXTENSION_SPACES,
  PK_SPACE_KEY,
} from '@/types/business.type';
import { useParams, usePathname } from 'next/navigation';
export enum EPageType {
  SPACES = 'spaces',
  HELP_DESK = 'help-desk',
  TEST_CHAT_FLOW = 'test-it-out',
  FORM = 'extension-form',
}
const MAPPED_INBOX_STATUS = {
  [EBusinessConversationKeys.Conversations]: null,
  [EBusinessConversationKeys.Archived]: 'archived',
};
export const useBusinessNavigationData = () => {
  const params = useParams();
  const pathname = usePathname();
  const isBusiness = pathname?.includes(EPageType.SPACES);
  const businessSlugs = params?.slugs || [];
  const isHelpDesk =
    pathname?.includes(EPageType.HELP_DESK) ||
    pathname?.includes(EPageType.FORM);
  const extensionId = params?.businessId;
  const isPreviewChatflowPage = pathname?.includes(EPageType.TEST_CHAT_FLOW);
  const isOnBusinessChat =
    params?.[PK_EXTENSION_SPACES] && businessSlugs?.length > 0;
  const isOnHelpDeskChat =
    isHelpDesk && businessSlugs?.length === 2 && !pathname?.includes('/rate/');
  const isUserChattingWithGuest = isBusiness && businessSlugs?.length == 1;

  const guestId = isUserChattingWithGuest ? businessSlugs?.[0] : null;
  const anonymousId = isOnHelpDeskChat ? businessSlugs?.[1] : null;
  const businessConversationType = isBusiness
    ? params?.[PK_EXTENSION_SPACES]
    : null;

  const spaceId = params?.[PK_SPACE_KEY];
  const businessRoomId = isOnBusinessChat ? businessSlugs?.[0] : null;
  return {
    isBusiness,
    isHelpDesk,
    isOnBusinessChat,
    isOnHelpDeskChat,
    isUserChattingWithGuest,
    guestId,
    businessRoomId,
    anonymousId,
    businessConversationType,
    spaceId,
    isPreviewChatflowPage,
    extensionId,
    inboxStatus:
      MAPPED_INBOX_STATUS[
        (businessConversationType || '') as EBusinessConversationKeys
      ],
  };
};
