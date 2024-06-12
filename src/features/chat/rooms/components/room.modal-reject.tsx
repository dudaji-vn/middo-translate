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

import { roomApi } from '../api';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

export interface RoomModalRejectProps {
  id: string;
  onClosed?: () => void;
}

export const RoomModalReject = (props: RoomModalRejectProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: roomApi.reject,
    onSuccess: () => {
      router.replace(ROUTE_NAMES.ONLINE_CONVERSATION);
    },
  });

  return (
    <AlertDialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) {
          props.onClosed?.();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('MODAL.REJECT_GROUP.TITLE')}</AlertDialogTitle>
          <AlertDialogDescription className="dark:text-neutral-50">
            {t('MODAL.REJECT_GROUP.DESCRIPTION')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="sm:mr-3">
            {t('COMMON.CANCEL')}
          </AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
            onClick={() => {
              mutate(props.id);
            }}
          >
            {t('COMMON.REJECT')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
