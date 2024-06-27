'use client';

import { Fragment, useEffect, useState } from 'react';

import { BellIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNotification } from '../hooks/use-notification';
import { ToastNotification } from './toast-notification';

export interface FCMBackgroundProps {}

export const FCMBackground = (props: FCMBackgroundProps) => {
  const { isShowRequestPermission, setPermission, retrieveToken } =
    useNotification();

  const [toastId, setToastId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isShowRequestPermission) {
      if (toastId) return;
      const id = toast.loading(
        (t) => (
          <ToastNotification
            onDismiss={() => {
              toast.dismiss(t.id);
            }}
            onEnable={() => {
              retrieveToken();
            }}
            onDeny={() => {
              setPermission('denied');
            }}
          />
        ),
        {
          icon: <BellIcon size={20} className="mx-1" />,
          className: '!max-w-none dark:bg-neutral-900 dark:text-neutral-50 dark:border dark:border-neutral-600',
          position: 'top-center',
        },
      );

      setToastId(id);
    } else {
      if (toastId) {
        toast.dismiss(toastId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowRequestPermission, toastId]);

  useEffect(() => {
    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [toastId]);

  return <Fragment></Fragment>;
};
