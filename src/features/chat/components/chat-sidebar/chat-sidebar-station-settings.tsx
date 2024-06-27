import { SettingTab } from '@/features/stations/components';
import { useTranslation } from 'react-i18next';
import { TabLayout } from './chat-sidebar-tab-layout';

export interface StationSettingTab {}

export const StationSettingTab = (props: StationSettingTab) => {
  const { t } = useTranslation('common');
  return (
    <TabLayout title={t('COMMON.STATION_SETTINGS')}>
      <SettingTab />
    </TabLayout>
  );
};
