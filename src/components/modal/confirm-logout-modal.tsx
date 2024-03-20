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
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export const ConfirmLogoutModal = () => {
  const { setData: setDataAuth } = useAuthStore();
  const {t} = useTranslation('common')
  const { isShowConfirmLogout, setShowConfirmLogout, platform } = useAppStore();
  const resetNotification = useNotificationStore((state) => state.reset);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOutService();
      setDataAuth({ user: null, isAuthentication: false });
      resetNotification();
      toast.success(t('MESSAGE.SUCCESS.SIGN_OUT'));
      const { deleteFCMToken } = await import('@/lib/firebase');
      await deleteFCMToken();
      if (platform === 'mobile') {
        router.push('/sign-out');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    }
  };
  const closeModal = () => {
    setShowConfirmLogout(false);
  };

  return (
    <AlertDialog open={isShowConfirmLogout} onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
           {t('MODAL.SIGN_OUT.TITLE')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('MODAL.SIGN_OUT.DESCRIPTION')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="sm:mr-3">{t('COMMON.CANCEL')}</AlertDialogCancel>
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
