import { useTranslation } from 'react-i18next';
import { GroupCreateSide } from '../../rooms/components/group-creator';
import { TabLayout } from './chat-sidebar-tab-layout';

export interface GroupTab {}

export const GroupTab = (props: GroupTab) => {
  const {t} = useTranslation('common');
  return (
    <TabLayout title={t('CONVERSATION.GROUP_CHAT')}>
      <GroupCreateSide />
    </TabLayout>
  );
};
