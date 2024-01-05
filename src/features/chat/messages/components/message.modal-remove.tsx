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

import { Button } from '@/components/actions';
import { Label } from '@/components/data-display';
import { messageApi } from '../api';
import { useMutation } from '@tanstack/react-query';

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
          <AlertDialogTitle>Remove message</AlertDialogTitle>
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
                  <Label htmlFor="option-two">For everyone</Label>
                </div>
                <div className="mt-1 pl-6 text-sm text-neutral-600">
                  This message will be removed in this conversation. Message may
                  has been seen or forwarded. Removed messages may still be
                  reported.
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="me" id="option-one" />
                  <Label htmlFor="option-one">For you</Label>
                </div>
                <div className="mt-1 pl-6 text-sm text-neutral-600">
                  This message will be removed on your end. Others in this
                  conversation can still see it.
                </div>
              </div>
            </>
          )}
          {!isMe && (
            <div className="text-sm text-neutral-600">
              This message will be removed on your end. Others in this
              conversation can still see it.
            </div>
          )}
        </RadioGroup>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction type="submit" onClick={handleSubmit} color="error">
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
