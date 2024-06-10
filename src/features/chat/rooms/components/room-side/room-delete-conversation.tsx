import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/feedback';

import { Button } from '@/components/actions';
import { Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useDeleteConversation } from '../../hooks/use-delete-conversation';
import { useTranslation } from 'react-i18next';
import { Item } from '@/components/data-display';

export interface RoomDeleteConversationProps {
  roomId: string;
  isGroup?: boolean;
}

export const RoomDeleteConversation = ({
  isGroup,
  roomId,
}: RoomDeleteConversationProps) => {
  const { mutate } = useDeleteConversation();
  const { t } = useTranslation('common');
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className='cursor-pointer'>
          <Item danger leftIcon={<Trash2 />}>
            {t('MODAL.DELETE_CONVERSATION.TITLE')}
          </Item>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('MODAL.DELETE_CONVERSATION.TITLE')} ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('MODAL.DELETE_CONVERSATION.DESCRIPTION')}
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
              mutate(roomId);
            }}
          >
            {t('COMMON.DELETE')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
