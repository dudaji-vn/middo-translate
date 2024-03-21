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

export interface RoomDeleteConversationProps {
  roomId: string;
  isGroup?: boolean;
}

export const RoomDeleteConversation = ({
  isGroup,
  roomId,
}: RoomDeleteConversationProps) => {
  const { mutate } = useDeleteConversation();
  const {t} = useTranslation('common');
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          startIcon={<Trash2 className="h-4 w-4 text-error-400-main" />}
          shape="square"
          color="default"
          size="md"
          className={cn('w-full ', isGroup ? 'rounded-t-[4px]' : '-mt-4')}
        >
          <span className="text-error-400-main">{t('MODAL.DELETE_CONVERSATION.TITLE')}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('MODAL.DELETE_CONVERSATION.TITLE')} ?</AlertDialogTitle>
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
