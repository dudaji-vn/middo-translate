import { IndividualSideCreate } from '../../rooms/components/individual-create-side';
import { TabLayout } from './chat-sidebar.tab-layout';

export interface GroupCreateTab {}

export const IndividualTab = (props: GroupCreateTab) => {
  return (
    <TabLayout title="New message">
      <IndividualSideCreate />
    </TabLayout>
  );
};
