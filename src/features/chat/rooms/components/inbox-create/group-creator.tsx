import { AnimatePresence, motion } from 'framer-motion';
import { Button, DropdownMenu } from '@/components/actions';
import { Camera, Checkmark, Close } from '@easy-eva-icons/react';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Typography,
} from '@/components/data-display';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Avatar } from '@/components/data-display/avatar';
import { SearchInput } from '@/components/data-entry';
import { User } from '@/features/users/types';
import { UserItem } from '@/features/users/components';
import { cn } from '@/utils/cn';
import { roomApi } from '@/features/chat/rooms/api';
import { searchApi } from '@/features/search/api';
import { useDropzone } from 'react-dropzone';
import { useInboxContext } from '../inbox/inbox-context';
import { useMutation } from '@tanstack/react-query';
import { useSearch } from '@/hooks/use-search';

export interface GroupCreatorProps {
  onBack?: () => void;
}

export const GroupCreator = (props: GroupCreatorProps) => {
  const { data, setSearchTerm } = useSearch<User[]>(searchApi.users);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { backToDefault } = useInboxContext();
  const router = useRouter();
  const selectedRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const handleRemoveUser = useCallback((user: User) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== user._id));
  }, []);
  const handleClickUser = useCallback((user: User) => {
    setSelectedUsers((prev) => {
      let newSelectedUsers = [];
      const index = prev.findIndex((u) => u._id === user._id);
      if (index === -1) {
        newSelectedUsers = [...prev, user];
      } else {
        newSelectedUsers = [...prev.slice(0, index), ...prev.slice(index + 1)];
      }

      return newSelectedUsers;
    });
  }, []);

  const { mutate, isLoading } = useMutation({
    mutationFn: roomApi.createRoom,
    onSuccess: (data) => {
      backToDefault();
      router.push(`/talk/${data._id}`);
    },
  });
  const [preview, setPreview] = useState<string | undefined>();
  const { getRootProps, getInputProps, open, acceptedFiles, inputRef } =
    useDropzone({
      noClick: true,
      multiple: false,
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      },
      onDropAccepted: (files) => {
        const file = files[0];
        const preview = URL.createObjectURL(file);
        setPreview(preview);
      },
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('name') as string;
    const participants = data.getAll('participants') as string[];
    let avatarFile: File | undefined;
    if (preview) {
      avatarFile = acceptedFiles[0];
    }
    mutate({
      name,
      participants,
      avatarFile,
    });
  };

  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollTo({
        left: selectedRef.current?.scrollWidth,
        behavior: 'smooth',
      });
    }
  }, [selectedUsers]);

  return (
    <AnimatePresence>
      <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-card shadow-sm">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center gap-3 space-y-1 p-5 py-2">
            {preview ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar
                    size="lg"
                    src={preview}
                    alt={selectedUsers[0]?.username}
                    className="ring-2 ring-background"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={open}>Change</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setPreview(undefined);
                    }}
                  >
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button.Icon
                color="default"
                onClick={open}
                type="button"
                className="shrink-0"
              >
                <Camera />
              </Button.Icon>
            )}

            <input
              placeholder="Type group name (optional)"
              name="name"
              className="flex-1 border-none px-0 outline-none ring-0 focus:border-none focus:outline-none focus:ring-offset-0 focus-visible:ring-0"
            />
          </div>
          <div className="z-10 items-center gap-2 space-y-1 p-4 py-2 pb-5 shadow-1">
            <SearchInput
              className="flex-1"
              onChange={(e) =>
                setSearchTerm(e.currentTarget.value.toLocaleLowerCase())
              }
              placeholder="Search"
            />
            {selectedUsers.length > 0 && (
              <div
                ref={selectedRef}
                className="!mt-5 flex gap-8 overflow-x-auto overflow-y-hidden"
              >
                <AnimatePresence>
                  {selectedUsers.map((user) => (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      key={user._id}
                    >
                      <SelectedUsersItem
                        onClick={() => handleRemoveUser(user)}
                        user={user}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="flex w-full flex-1 flex-col overflow-y-auto">
            {data?.map((user) => {
              const isChecked = !!selectedUsers.find((u) => u._id === user._id);
              return (
                <UserItem
                  key={user._id}
                  isActive={isChecked}
                  onClick={() => handleClickUser(user)}
                  user={user}
                  rightElement={
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full border border-stroke p-[0.5px] ">
                      {isChecked && (
                        <Checkmark className="h-3 w-3 rounded-full bg-primary text-background" />
                      )}
                    </div>
                  }
                />
              );
            })}
          </div>
          {selectedUsers.length > 1 && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className={cn('shadow-n-1 p-3')}
            >
              <Button className="w-full">Create</Button>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};

const SelectedUsersItem = ({
  user,
  onClick,
}: {
  user: User;
  onClick?: () => void;
}) => {
  const name = user.username.split(' ')[0];
  return (
    <div
      onClick={onClick}
      className="flex max-w-[60px] shrink-0 cursor-pointer flex-col gap-2 overflow-hidden"
    >
      <div className="relative flex justify-center">
        <Avatar
          size="lg"
          className="h-12 w-12"
          src={user.avatar}
          shape="circle"
          alt={user.username}
        />
        <div className="absolute right-0 top-0 rounded-full bg-background shadow-1">
          <Close />
        </div>
      </div>
      <Typography className="truncate">{name}</Typography>
    </div>
  );
};
