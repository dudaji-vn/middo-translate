export enum EBusinessConversationKeys {
  Conversations = 'conversations',
  Archived = 'archived',
  Completed = 'completed',
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

export const PK_BUSINESS_CONVERSATIONS = 'conversationType';
export enum EBusinessSidebarKeys {
  Conversations = 'conversations',
  Archived = 'archived',
  Completed = 'completed',
  Settings = 'settings',
  Statistic = 'statistics',
}
