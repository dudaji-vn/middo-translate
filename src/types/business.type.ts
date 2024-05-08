export enum EBusinessConversationKeys {
  Conversations = 'conversations',
  Archived = 'archived',
}

export const isBusinessConversation = (
  value?: string | string[] | null | undefined,
): value is EBusinessConversationKeys => {
  if (typeof value === 'string') {
    return Object.values(EBusinessConversationKeys).includes(
      value as EBusinessConversationKeys,
    );
  } else if (Array.isArray(value)) {
    return value.every(
      (val) =>
        typeof val === 'string' &&
        Object.values(EBusinessConversationKeys).includes(
          val as EBusinessConversationKeys,
        ),
    );
  } else {
    return false;
  }
};

export const PK_SPACE_KEY = 'spaceId';
export const PK_BUSINESS_SPACES = 'conversationType';
export enum EBusinessSidebarKeys {
  Conversations = 'conversations',
  Archived = 'archived',
  Settings = 'settings',
  Statistic = 'statistics',
}

export const LSK_VISITOR_ID = 'visitor_id';
export const LSK_VISITOR_ROOM_ID = 'visitor_room_id';
