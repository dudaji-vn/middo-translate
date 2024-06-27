import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../feedback';

import { signOutService } from '@/services/auth.service';
import toast from 'react-hot-toast';
import { useAppStore } from '@/stores/app.store';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationStore } from '@/features/notification/store';
import { useTranslation } from 'react-i18next';
import { useReactNativePostMessage } from '@/hooks/use-react-native-post-message';
import { notificationApi } from '@/features/notification/api';
import customToast from '@/utils/custom-toast';

export const ConfirmLogoutModal = () => {
  const { setData: setDataAuth } = useAuthStore();
  const { t } = useTranslation('common');
  const { isShowConfirmLogout, setShowConfirmLogout } = useAppStore();
  const resetNotification = useNotificationStore((state) => state.reset);
  const { postMessage } = useReactNativePostMessage();
  const handleLogout = async () => {
    try {
      postMessage({
        type: 'Trigger',
        data: {
          event: 'sign-out',
        },
      });
      if (typeof window !== 'undefined' && 'Notification' in window) {
        const currentPermission = Notification.permission;
        if (currentPermission === 'granted') {
          const { requestForToken } = await import('@/lib/firebase');
          const token = await requestForToken();
          if (token) {
            await notificationApi.unsubscribe(token);
          }
        }
      }
      await signOutService();
      setDataAuth({ user: null, isAuthentication: false });
      resetNotification();
      customToast.success(t('MESSAGE.SUCCESS.SIGN_OUT'));
      const { deleteFCMToken } = await import('@/lib/firebase');
      await deleteFCMToken();
    } catch (err: any) {
      customToast.error(err?.response?.data?.message);
    }
  };
  const closeModal = () => {
    setShowConfirmLogout(false);
  };

  return (
    <AlertDialog open={isShowConfirmLogout} onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('MODAL.SIGN_OUT.TITLE')}</AlertDialogTitle>
          <AlertDialogDescription className="mt-2 md:mt-0 dark:text-neutral-50">
            {t('MODAL.SIGN_OUT.DESCRIPTION')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="sm:mr-3">
            {t('COMMON.CANCEL')}
          </AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
            onClick={handleLogout}
          >
            {t('COMMON.SIGN_OUT')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
