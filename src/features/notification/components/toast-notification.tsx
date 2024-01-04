import { XIcon } from 'lucide-react';
import { useState } from 'react';

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

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  if (isDismissed)
    return (
      <div className="flex w-full">
        <span>
          Are you sure? Without notifications, it’s much harder for your team to
          reach you.{' '}
          <TextUnderlineClickAble onClick={onEnable}>
            Enable notifications
          </TextUnderlineClickAble>
          <span className="mx-2">/</span>
          <TextUnderlineClickAble onClick={onDismiss}>
            I&apos;ll do this later
          </TextUnderlineClickAble>
          <span className="mx-2">/</span>
          <TextUnderlineClickAble onClick={onDeny}>
            Don&apos;t ask again
          </TextUnderlineClickAble>
        </span>
        <span></span>
      </div>
    );
  return (
    <div className="flex w-full">
      <span>
        Middo needs your permission to{' '}
        <TextUnderlineClickAble onClick={onEnable}>
          enable notifications
        </TextUnderlineClickAble>
      </span>
      <button onClick={handleDismiss} className="ml-3">
        <XIcon width={20} height={20} />
      </button>
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
