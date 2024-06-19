import { Blocks, Tag, UsersRound } from 'lucide-react';

export enum ESPaceRoles {
  Owner = 'owner',
  Admin = 'admin',
  Member = 'member',
  Viewer = 'viewer',
}
export enum ERoleActions {
  VIEW = 'view',
  EDIT = 'edit',
  DELETE = 'delete',
}

export const MANAGE_SPACE_ROLES: Record<
  ERoleActions | 'invite-member',
  Array<ESPaceRoles>
> = {
  edit: [ESPaceRoles.Owner, ESPaceRoles.Admin],
  delete: [ESPaceRoles.Owner],
  view: Array.from(Object.values(ESPaceRoles)),
  'invite-member': [ESPaceRoles.Owner, ESPaceRoles.Admin],
};

export const SPACE_SETTING_TAB_ROLES: Array<{
  label: string;
  name: string;
  icon: React.ReactNode;
  roles: Record<ERoleActions, Array<ESPaceRoles>>;
}> = [
  {
    label: 'EXTENSION.SETTING.MEMBERS_MANAGEMENT',
    name: 'members',
    icon: <UsersRound />,
    roles: {
      view: [ESPaceRoles.Owner, ESPaceRoles.Admin],
      edit: [ESPaceRoles.Owner, ESPaceRoles.Admin],
      delete: [ESPaceRoles.Owner],
    },
  },
  {
    label: 'EXTENSION.SETTING.TAGS_MANAGEMENT',
    name: 'tags',
    icon: <Tag />,
    roles: {
      view: [ESPaceRoles.Owner, ESPaceRoles.Admin],
      edit: [ESPaceRoles.Owner, ESPaceRoles.Admin],
      delete: [ESPaceRoles.Owner, ESPaceRoles.Admin],
    },
  },
  {
    label: 'EXTENSION.SETTING.CONVERSATION_EXTENSION',
    name: 'extension',
    icon: <Blocks />,
    roles: {
      view: [ESPaceRoles.Owner, ESPaceRoles.Admin],
      edit: [ESPaceRoles.Owner, ESPaceRoles.Admin],
      delete: [ESPaceRoles.Owner],
    },
  },
];
