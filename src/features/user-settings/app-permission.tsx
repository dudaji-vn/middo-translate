import { Button } from '@/components/actions';
import { SettingsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePlatformStore } from '../platform/stores';
import { useReactNativePostMessage } from '@/hooks/use-react-native-post-message';
import { Item } from '@/components/data-display';

export interface AppPermissionProps {}

export const AppPermission = (props: AppPermissionProps) => {
  const isMobile = usePlatformStore((state) => state.platform === 'mobile');
  const { postMessage } = useReactNativePostMessage();
  const { t } = useTranslation('common');
  const handleClick = () => {
    postMessage({ type: 'Trigger', data: { event: 'open-app-permission' } });
  };
  if (!isMobile) return null;

  return (
    <Item
      neutral
      onClick={handleClick}
      leftIcon={<SettingsIcon />}
      className="gap-5 pl-5 font-medium"
    >
      {t('ACCOUNT_SETTING.APP_PERMISSION')}{' '}
    </Item>
  );
};
