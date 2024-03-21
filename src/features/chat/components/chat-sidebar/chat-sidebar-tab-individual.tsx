import { useTranslation } from 'react-i18next';
import { IndividualSideCreate } from '../../rooms/components/individual-create-side';
import { TabLayout } from './chat-sidebar-tab-layout';

export interface GroupCreateTab {}

export const IndividualTab = (props: GroupCreateTab) => {
  const {t} = useTranslation('common');
  return (
    <TabLayout title={t('CONVERSATION.NEW')}>
      <IndividualSideCreate />
    </TabLayout>
  );
};
