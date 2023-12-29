import { GroupCreateSide } from '../../rooms/components/group-creator';

export interface GroupCreateTab {}

export const GroupCreateTab = (props: GroupCreateTab) => {
  return (
    <div>
      <GroupCreateSide />
    </div>
  );
};
