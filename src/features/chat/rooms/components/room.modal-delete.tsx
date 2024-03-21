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

import { useDeleteConversation } from '../hooks/use-delete-conversation';
import { useTranslation } from 'react-i18next';

export interface RoomModalDeleteProps {
  id: string;
  onClosed?: () => void;
}

export const RoomModalDelete = (props: RoomModalDeleteProps) => {
  const { mutateAsync } = useDeleteConversation();
  const {t} = useTranslation('common')
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
          <AlertDialogTitle>{t('MODAL.DELETE_CONVERSATION.TITLE')}</AlertDialogTitle>
          <AlertDialogDescription>
          {t('MODAL.DELETE_CONVERSATION.DESCRIPTION')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="sm:mr-3">{t('COMMON.CANCEL')}</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
            onClick={() => {
              mutateAsync(props.id);
            }}
          >
            {t('COMMON.DELETE')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
