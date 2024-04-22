export enum ESPaceRoles {
  Owner = 'owner',
  Admin = 'admin',
  Member = 'member',
}
export type SpaceRoleAction = 'view' | 'edit' | 'delete';

export const SPACE_SETTING_ITEMS: Array<{
  label: string;
  name: string;
  roles: Record<SpaceRoleAction, Array<ESPaceRoles>>;
}> = [
  {
    label: 'Members Management',
    name: 'members',
    roles: {
      view: Array.from(Object.values(ESPaceRoles)),
      edit: [ESPaceRoles.Owner, ESPaceRoles.Admin],
      delete: [ESPaceRoles.Owner],
    },
  },
  {
    label: 'Tags Management',
    name: 'tags',
    roles: {
      view: Array.from(Object.values(ESPaceRoles)),
      edit: [ESPaceRoles.Owner, ESPaceRoles.Admin],
      delete: [ESPaceRoles.Owner],
    },
  },
  {
    label: 'Conversation Extension',
    name: 'extension',
    roles: {
      view: Array.from(Object.values(ESPaceRoles)),
      edit: [ESPaceRoles.Owner],
      delete: [ESPaceRoles.Owner],
    },
  },
];

