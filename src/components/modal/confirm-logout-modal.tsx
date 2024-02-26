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

export const ConfirmLogoutModal = () => {
  const { setData: setDataAuth } = useAuthStore();

  const { isShowConfirmLogout, setShowConfirmLogout, platform } = useAppStore();
  const resetNotification = useNotificationStore((state) => state.reset);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOutService();
      setDataAuth({ user: null, isAuthentication: false });
      resetNotification();
      toast.success('Sign out success!');
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
            Are you sure you want to sign out?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You will be sign out of the application and will need to sign in
            again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="sm:mr-3">Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
            onClick={handleLogout}
          >
            Sign out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
