'use client';
import { Item } from '@/components/data-display';
import { Switch } from '@/components/data-entry';
import { useReactNativePostMessage } from '@/hooks/use-react-native-post-message';
import { BellIcon, SettingsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../notification/hooks/use-notification';
import { usePlatformStore } from '../platform/stores';

export interface TurnOffNotificationProps {}

export const TurnOffNotification = (props: TurnOffNotificationProps) => {
  const { t } = useTranslation('common');
  const { isSubscribed, fcmToken, retrieveToken, turnOff } = useNotification();
  const platform = usePlatformStore((state) => state.platform);
  const { postMessage } = useReactNativePostMessage();

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
      retrieveToken();
    }
  };

  return (
    <Item
      
      leftIcon={<BellIcon />}
      className="gap-5 pl-5 font-medium dark:bg-neutral-900 dark:text-neutral-50 pr-5 border-b dark:border-b-neutral-800"
      right={<Switch checked={isSubscribed} onClick={handleToggle} />}
    >
      {t('ACCOUNT_SETTING.NOTIFICATION')}{' '}
    </Item>
  );
};
