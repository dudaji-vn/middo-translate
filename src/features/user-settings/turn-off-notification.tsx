'use client';
import { Item } from '@/components/data-display';
import { Switch } from '@/components/data-entry';
import { useReactNativePostMessage } from '@/hooks/use-react-native-post-message';
import { BellIcon, SettingsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../notification/hooks/use-notification';
import { usePlatformStore } from '../platform/stores';
import { useElectron } from '@/hooks';
import { notificationApi } from '../notification/api';

export interface TurnOffNotificationProps {}

export const TurnOffNotification = (props: TurnOffNotificationProps) => {
  const { t } = useTranslation('common');
  const {
    isSubscribed,
    fcmToken,
    retrieveToken,
    turnOff,
    setFcmToken,
    retrieveTokenElectron,
  } = useNotification();
  const platform = usePlatformStore((state) => state.platform);
  const { postMessage } = useReactNativePostMessage();
  const { isElectron, ipcRenderer, electron } = useElectron();
  const handleToggle = async () => {
    if (isSubscribed) {
      if (!fcmToken) return;
      if (platform === 'mobile') {
        postMessage({
          type: 'Trigger',
          data: { event: 'turn-off-notification' },
        });
        return;
      }
      turnOff();
    } else {
      if (platform === 'mobile') {
        postMessage({
          type: 'Trigger',
          data: { event: 'turn-on-notification' },
        });
        return;
      }
      if (isElectron) {
        retrieveTokenElectron();
      } else {
        retrieveToken();
      }
    }
  };

  return (
    <Item
      leftIcon={<BellIcon />}
      className="gap-5 border-b pl-5 pr-5 font-medium dark:border-b-neutral-800 dark:bg-neutral-900 dark:text-neutral-50"
      right={<Switch checked={!isSubscribed} onClick={handleToggle} />}
    >
      {t('ACCOUNT_SETTING.NOTIFICATION')}{' '}
    </Item>
  );
};
