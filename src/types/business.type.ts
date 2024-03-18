export enum EBusinessConversation {
  Conversations = 'conversations',
  Archived = 'archived',
  Completed = 'completed',
}

export const isBusinessConversation = (
  value?: string | string[] | null | undefined,
): value is EBusinessConversation => {
  if (typeof value === 'string') {
    return Object.values(EBusinessConversation).includes(
      value as EBusinessConversation,
    );
  } else if (Array.isArray(value)) {
    return value.every(
      (val) =>
        typeof val === 'string' &&
        Object.values(EBusinessConversation).includes(
          val as EBusinessConversation,
        ),
    );
  } else {
    return false;
  }
};

export const PK_BUSINESS_CONVERSATIONS = 'conversationType';
export enum EBUSINESS_SIDEBAR_KEYS {
  Conversations = 'conversations',
  Archived = 'archived',
  Completed = 'completed',
  Settings = 'settings',
  Statistic = 'statistics',
}
