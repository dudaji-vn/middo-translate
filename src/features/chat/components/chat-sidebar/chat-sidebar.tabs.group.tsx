import { GroupCreateSide } from '../../rooms/components/group-creator';
import { TabLayout } from './chat-sidebar.tab-layout';

export interface GroupTab {}

export const GroupTab = (props: GroupTab) => {
  return (
    <TabLayout title="Group chat">
      <GroupCreateSide />
    </TabLayout>
  );
};
