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
          <div className="flex items-center space-x-2">
            <RadioGroupItem disabled={!isMe} value="all" id="option-two" />
            <Label htmlFor="option-two">For everyone</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="me" id="option-one" />
            <Label htmlFor="option-one">For you</Label>
          </div>
        </RadioGroup>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction type="submit" onClick={handleSubmit}>
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
