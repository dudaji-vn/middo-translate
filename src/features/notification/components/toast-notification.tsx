import { Button } from '@/components/actions';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface ToastNotificationProps {
  onEnable: () => void;
  onDismiss: () => void;
  onDeny: () => void;
}

export const ToastNotification = ({
  onDismiss,
  onEnable,
  onDeny,
}: ToastNotificationProps) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const {t} = useTranslation('common')
  const handleDismiss = () => {
    setIsDismissed(true);
  };

  if (isDismissed)
    return (
      <div className="flex w-full items-center">
        <span className="text-center">
          {t('NOTIFICATION.WITHOUT_NOTIFICATIONS')}&nbsp;
          <br />
          <TextUnderlineClickAble onClick={onEnable}>
            {t('NOTIFICATION.ENABLE')}
          </TextUnderlineClickAble>
          {/* <span className="mx-2">/</span> */}
          {/* <TextUnderlineClickAble onClick={onDismiss}>
            {t('NOTIFICATION.LATER')}
          </TextUnderlineClickAble> */}
          <span className="mx-2">/</span>
          <TextUnderlineClickAble onClick={onDeny}>
            {t('NOTIFICATION.DENY')}
          </TextUnderlineClickAble>
        </span>
        <Button.Icon 
            variant={'ghost'}
            color={'default'}
            size={'ss'}
            onClick={onDismiss} 
            className="ml-2"
        >
            <XIcon size={16} />
        </Button.Icon>
      </div>
    );
  return (
    <div className="flex w-full items-center">
      <span>
        {t('NOTIFICATION.MESSAGE')}&nbsp;
        <TextUnderlineClickAble onClick={onEnable}>
        {t('NOTIFICATION.ENABLE')}
        </TextUnderlineClickAble>
      </span>
      <Button.Icon 
        variant={'ghost'}
        color={'default'}
        size={'ss'}
        onClick={handleDismiss} 
        className="ml-2"
      >
        <XIcon size={16} />
      </Button.Icon>
    </div>
  );
};

const TextUnderlineClickAble = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <span onClick={onClick} className="cursor-pointer font-medium underline">
      {children}
    </span>
  );
};
