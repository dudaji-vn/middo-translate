import { useTranslation } from 'react-i18next';
import { TabLayout } from './chat-sidebar-tab-layout';
import { NewCallSide } from '../../rooms/components/new-call-side';

export interface GroupCreateTab {}

export const NewCallTab = (props: GroupCreateTab) => {
  const {t} = useTranslation('common');
  return (
    <TabLayout title={t('CONVERSATION.NEW_CALL')}>
      <NewCallSide />
    </TabLayout>
  );
};
