import { User } from '@/features/users/types';
import { TSpace } from '../../../_components/business-spaces';
import { Member } from '../../../_components/spaces-crud/sections/members-columns';
import { ESPaceRoles } from './setting-items';

export const getUserSpaceRole = (
  currentUser: {
    _id: string;
    email: string;
  } | null,
  space: TSpace | null,
) => {
  if (!currentUser || !space) {
    return undefined;
  }
  return space.owner?.email === currentUser?.email
    ? ESPaceRoles.Owner
    : space.members?.find(
          (member) =>
            member.email === currentUser?.email &&
            member.role === ESPaceRoles.Admin,
        )
      ? ESPaceRoles.Admin
      : ESPaceRoles.Member;
};
