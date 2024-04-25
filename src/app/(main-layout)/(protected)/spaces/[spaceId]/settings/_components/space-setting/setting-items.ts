export enum ESPaceRoles {
  Owner = 'owner',
  Admin = 'admin',
  Member = 'member',
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
  roles: Record<ERoleActions, Array<ESPaceRoles>>;
}> = [
  {
    label: 'Members Management',
    name: 'members',
    roles: {
      view: [ESPaceRoles.Owner, ESPaceRoles.Admin],
      edit: [ESPaceRoles.Owner, ESPaceRoles.Admin],
      delete: [ESPaceRoles.Owner],
    },
  },
  {
    label: 'Tags Management',
    name: 'tags',
    roles: {
      view: [ESPaceRoles.Owner, ESPaceRoles.Admin],
      edit: [ESPaceRoles.Owner, ESPaceRoles.Admin],
      delete: [ESPaceRoles.Owner],
    },
  },
  {
    label: 'Conversation Extension',
    name: 'extension',
    roles: {
      view: [ESPaceRoles.Owner, ESPaceRoles.Admin],
      edit: [ESPaceRoles.Owner],
      delete: [ESPaceRoles.Owner],
    },
  },
];
