import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/feedback';
import { useId, useRef } from 'react';

import { Button } from '@/components/actions';
import { Input } from '@/components/data-entry';
import { Pen } from 'lucide-react';
import { toast } from '@/components/toast';

export interface RoomUpdateNameProps {}

export const RoomUpdateName = (props: RoomUpdateNameProps) => {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('name') as string;
    toast({
      title: 'Success',
      description: 'Group name has been changed to ' + name,
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button.Icon
          onClick={() => {
            setTimeout(() => {
              inputRef.current?.focus();
            }, 100);
          }}
          color="secondary"
          type="button"
          className="shrink-0"
        >
          <Pen />
        </Button.Icon>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change group name</AlertDialogTitle>
          <form id={id} onSubmit={handleSubmit}>
            <Input ref={inputRef} name="name" placeholder="Type a group name" />
          </form>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="mr-4">Cancel</AlertDialogCancel>
          <AlertDialogAction form={id} type="submit">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
