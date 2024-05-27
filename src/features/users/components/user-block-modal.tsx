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

import { useTranslation } from 'react-i18next';
import { User } from '@/features/users/types';
import { Checkbox } from '@/components/form/checkbox';
import { Label } from '@/components/ui/label';
import { useBlockUser } from '../hooks/use-block-user';
import { useState } from 'react';
import { useDeleteConversation } from '@/features/chat/rooms/hooks/use-delete-conversation';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Room } from '@/features/chat/rooms/types';

export interface UserBlockModalProps {
  user: User;
  onClosed?: () => void;
  room: Room;
}

export const UserBlockModal = (props: UserBlockModalProps) => {
  const { t } = useTranslation('common');
  const { mutateAsync } = useBlockUser();
  const { mutate: deleteRoom } = useDeleteConversation();
  const [isAdditionalOptionChecked, setIsAdditionalOptionChecked] =
    useState<CheckedState>(false);

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
            {t('MODAL.BLOCK_USER.TITLE', {
              name: props.user.name,
            })}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {t('MODAL.BLOCK_USER.DESCRIPTION')}
          </AlertDialogDescription>
          <div className="mt-3 flex items-center gap-2">
            <Checkbox
              checked={isAdditionalOptionChecked}
              onCheckedChange={setIsAdditionalOptionChecked}
              id={props.user._id + 'block-check'}
            />
            <Label htmlFor={props.user._id + 'block-check'}>
              {t('MODAL.BLOCK_USER.ADDITIONAL_OPTION_1')}
            </Label>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="sm:mr-3">
            {t('COMMON.CANCEL')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await mutateAsync(props.user._id);
              if (isAdditionalOptionChecked) {
                deleteRoom(props.room._id);
              }
            }}
            type="submit"
            className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
          >
            {t('COMMON.BLOCK')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
