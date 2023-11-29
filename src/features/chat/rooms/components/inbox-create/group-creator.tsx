import {
  Camera,
  CameraOutline,
  Close,
  CloseCircleOutline,
  PeopleOutline,
} from '@easy-eva-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/actions/dropdown-menu';
import { Fragment, useCallback, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Avatar } from '@/components/data-display/avatar';
import { Button } from '@/components/actions/button';
import { Chip } from '@/components/data-display/chip/chip';
import { Input } from '@/components/data-entry/input';
import { Button as OldButton } from '@/components/button';
import { SearchInput } from '@/components/data-entry';
import { Typography } from '@/components/data-display';
import { User } from '@/features/users/types';
import { UserItem } from '@/features/users/components';
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
  const params = useParams();
  const originId = useRef(params?.id);
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

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-card shadow-sm">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-3 space-y-1 p-4 py-2">
          <Button.Icon
            size="lg"
            onClick={open}
            type="button"
            shape="circle"
            className="shrink-0"
          >
            <Camera />
          </Button.Icon>
          <input
            placeholder="Type group name (optional)"
            name="name"
            className="flex-1 border-none px-0 outline-none ring-0 focus:border-none focus:outline-none focus:ring-offset-0 focus-visible:ring-0"
          />
        </div>
        <div className="items-center gap-2 space-y-1 p-4 py-2 pb-5 shadow-1">
          <SearchInput
            className="flex-1"
            onChange={(e) =>
              setSearchTerm(e.currentTarget.value.toLocaleLowerCase())
            }
            placeholder="Search"
          />
          <div className="!mt-5 flex gap-8 overflow-x-auto">
            {selectedUsers.map((user) => (
              <SelectedUsersItem
                onClick={() => handleRemoveUser(user)}
                key={user._id}
                user={user}
              />
            ))}
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col gap-2 overflow-y-auto">
          {data?.map((user) => (
            <UserItem
              isActive={!!selectedUsers.find((u) => u._id === user._id)}
              onClick={() => handleClickUser(user)}
              key={user._id}
              user={user}
            />
          ))}
        </div>
      </div>
    </div>
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
      className="relative flex max-w-[60px] shrink-0 cursor-pointer flex-col gap-2 overflow-hidden"
    >
      <Avatar
        size="lg"
        className="h-12 w-12"
        src={user.avatar}
        shape="circle"
        alt={user.username}
      />
      <Typography className="truncate">{name}</Typography>
      <div className="absolute right-3 top-0 rounded-full bg-background shadow-1">
        <Close />
      </div>
    </div>
  );
};
