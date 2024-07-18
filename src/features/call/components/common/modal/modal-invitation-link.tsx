import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/feedback';
import { useVideoCallStore } from '../../../store/video-call.store';
import { useTranslation } from 'react-i18next';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import { Button } from '@/components/actions';
import { useTextCopy } from '@/hooks';

export const ModalInvitationLink = () => {
  const { t } = useTranslation('common');
  const setModal = useVideoCallStore((state) => state.setModal);
  const modal = useVideoCallStore((state) => state.modal);
  const room = useVideoCallStore((state) => state.room);
  const { copy } = useTextCopy();
  const copyAndClose = () => {
    copy(`${NEXT_PUBLIC_URL}/call/${room?._id}`);
    setModal();
  }
  return (
    <div>
      <AlertDialog
        open={modal == 'show-invitation'}
        onOpenChange={() => setModal()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('MODAL.INVITATION_LINK.TITLE')}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div>
            <p className='mb-3 text-sm text-neutral-600 dark:text-neutral-200'>{t('MODAL.INVITATION_LINK.DESCRIPTION')}</p>
            <div className="flex cursor-pointer items-center justify-center rounded-xl border border-neutral-100 bg-white p-3 dark:border-neutral-700 dark:bg-background">
              <span className="flex-1 truncate font-semibold text-primary">{`${NEXT_PUBLIC_URL}/call/${room?._id}`}</span>
            </div>
          </div>
          <AlertDialogFooter>
            <Button
                shape={'square'}
                size={'sm'}
                onClick={()=>copyAndClose()}
            >
                {t('COMMON.COPY_AND_CLOSE')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
