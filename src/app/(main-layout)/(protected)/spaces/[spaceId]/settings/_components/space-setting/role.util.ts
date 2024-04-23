import { User } from '@/features/users/types';
import { TSpace } from '../../../_components/business-spaces';
import { Member } from '../../../_components/spaces-crud/sections/members-columns';
import { ESPaceRoles } from './setting-items';

export const getUserSpaceRole = (
  currentUser: {
    _id: string;
    email: string;
  } | null,
  space: TSpace,
) => {
  if (!currentUser) {
    return undefined;
  }
  return space.owner?._id === currentUser?._id
    ? ESPaceRoles.Owner
    : space.members?.find(
          (member) =>
            member._id === currentUser?._id &&
            member.role === ESPaceRoles.Admin,
        )
      ? ESPaceRoles.Admin
      : ESPaceRoles.Member;
};
