import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/feedback';
import { PropsWithChildren, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/data-entry';

import { Label } from '@/components/data-display';
import { messageApi } from '../api';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export const MessageModalRemove = ({
  id,
  isMe,
  onClosed,
}: PropsWithChildren & {
  id: string;
  isMe: boolean;
  onClosed?: () => void;
}) => {
  const { mutate } = useMutation({
    mutationFn: messageApi.remove,
  });
  const {t} = useTranslation('common')
  const [removeType, setRemoveType] = useState<'all' | 'me'>('me');
  const handleSubmit = () => {
    if (!isMe) {
      mutate({
        id,
        type: 'me',
      });
      return;
    }
    mutate({
      id,
      type: removeType,
    });
  };
  return (
    <AlertDialog
      defaultOpen
      onOpenChange={(open) => {
        if (open) return;
        onClosed?.();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("MODAL.REMOVE_MESSAGE.TITLE")}</AlertDialogTitle>
        </AlertDialogHeader>
        <RadioGroup
          value={removeType}
          onValueChange={(value) => setRemoveType(value as any)}
          defaultValue="me"
        >
          {isMe && (
            <>
              <div className="pb-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    disabled={!isMe}
                    value="all"
                    id="option-two"
                  />
                  <Label htmlFor="option-two">{t("MODAL.REMOVE_MESSAGE.FOR_ALL.TITLE")}</Label>
                </div>
                <div className="mt-1 pl-6 text-sm text-neutral-600">
                  {t("MODAL.REMOVE_MESSAGE.FOR_ALL.DESCRIPTION")}
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="me" id="option-one" />
                  <Label htmlFor="option-one">{t("MODAL.REMOVE_MESSAGE.FOR_YOU.TITLE")}</Label>
                </div>
                <div className="mt-1 pl-6 text-sm text-neutral-600">
                {t("MODAL.REMOVE_MESSAGE.FOR_YOU.DESCRIPTION")}
                </div>
              </div>
            </>
          )}
          {!isMe && (
            <div className="text-sm text-neutral-600">
              {t("MODAL.REMOVE_MESSAGE.FOR_YOU.DESCRIPTION")}
            </div>
          )}
        </RadioGroup>

        <AlertDialogFooter>
          <AlertDialogCancel>{t("COMMON.CANCEL")}</AlertDialogCancel>
          <AlertDialogAction type="submit" onClick={handleSubmit} color="error">
          {t("COMMON.DELETE")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
