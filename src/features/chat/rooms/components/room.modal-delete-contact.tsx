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
import { ROUTE_NAMES } from '@/configs/route-name';
import { useDeleteContact } from '../hooks/use-delete-contact';

export interface RoomModalDeleteContactProps {
  id: string;
  onClosed?: () => void;
}

export const RoomModalDeleteContact = (props: RoomModalDeleteContactProps) => {
  const { mutateAsync } = useDeleteContact();
  const router = useRouter();
  const { t } = useTranslation('common');

  const handleDelete = async () => {
    try {
      await mutateAsync(props.id);
      props.onClosed?.();
    } catch (error) {
      console.error(error);
    }
  };
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
          <AlertDialogTitle>
            {t('MODAL.DELETE_CONTACT.TITLE')}
          </AlertDialogTitle>
          <AlertDialogDescription className="dark:text-neutral-50">
            {t('MODAL.DELETE_CONTACT.DESCRIPTION')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="sm:mr-3">
            {t('COMMON.CANCEL')}
          </AlertDialogCancel>
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
