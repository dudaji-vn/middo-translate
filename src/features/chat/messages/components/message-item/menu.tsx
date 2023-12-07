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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Label,
} from '@/components/data-display';
import { MoreVertical, PinIcon, Trash } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/data-entry';

import { Button } from '@/components/actions';
import { Message } from '@/features/chat/messages/types';
import { cn } from '@/utils/cn';
import { messageApi } from '../../api';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export interface MenuProps {
  message: Message;
  isMe: boolean;
}

export const Menu = ({ message, isMe }: MenuProps) => {
  const { mutate } = useMutation({
    mutationFn: messageApi.remove,
  });
  const [removeType, setRemoveType] = useState<'all' | 'me'>('me');
  const handleSubmit = () => {
    mutate({
      id: message._id,
      type: removeType,
    });
  };
  return (
    <div
      className={cn(
        'absolute top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100',
        isMe ? '-left-4 -translate-x-full' : '-right-4 translate-x-full',
      )}
    >
      {message.status !== 'removed' && (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button.Icon size="sm" variant="ghost" color="default">
                <MoreVertical />
              </Button.Icon>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <AlertDialogTrigger className="w-full">
                <DropdownMenuItem>
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Remove</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <DropdownMenuGroup>
                <DropdownMenuItem disabled>
                  <PinIcon className="mr-2 h-4 w-4" />
                  <span>Pin</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Who do you want to remove this message for?
              </AlertDialogTitle>
              <AlertDialogDescription>
                <RadioGroup
                  value={removeType}
                  onValueChange={(value) => setRemoveType(value as any)}
                  defaultValue="me"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      disabled={!isMe}
                      value="all"
                      id="option-two"
                    />
                    <Label htmlFor="option-two">For everyone</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="me" id="option-one" />
                    <Label htmlFor="option-one">For you</Label>
                  </div>
                </RadioGroup>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:bg-slate-400">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleSubmit}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
