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
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { useRouter } from 'next/navigation';
import { roomApi } from '../api';

export interface RoomModalDeleteProps {
  id: string;
  onClosed?: () => void;
}

export const RoomModalDelete = (props: RoomModalDeleteProps) => {
  const { isBusiness, isOnBusinessChat, businessRoomId, businessConversationType } = useBusinessNavigationData();
  const { mutateAsync } = useDeleteConversation();
  const router = useRouter();
  const { t } = useTranslation('common')

  const handleDelete = async () => {
    try {
      if (isBusiness) {
        await roomApi.deleteAllMessages(props.id);
        props.onClosed?.();
        if (isOnBusinessChat && businessRoomId === props.id)
          router.push(`/${businessConversationType}`);
        return;
      }
      await mutateAsync(props.id);
      props.onClosed?.();
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <AlertDialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) {
          props.onClosed?.();
          if (isOnBusinessChat)
            router.back();
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
            onClick={handleDelete}
          >
            {t('COMMON.DELETE')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
