import {
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';

import { Button } from '@/components/actions';
import { CameraIcon } from 'lucide-react';
import { SearchInput } from '@/components/data-entry';
import { SelectedList } from '../selected-list';
import { User } from '@/features/users/types';
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';

export interface GroupCreateHeaderProps {
  handleCreateGroup: (data: {
    name: string;
    participants: string[];
    avatarFile?: File;
  }) => void;
  setSearchTerm: (term: string) => void;
  selectedUsers: User[];
  handleUnSelectUser: (user: User) => void;
}

export const GroupCreateHeader = ({
  handleCreateGroup,
  setSearchTerm,
  selectedUsers,
  handleUnSelectUser,
}: GroupCreateHeaderProps) => {
  const [preview, setPreview] = useState<string | undefined>();

  const { getInputProps, open, acceptedFiles, inputRef } = useDropzone({
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
    const participants = selectedUsers.map((user) => user._id);
    let avatarFile: File | undefined;
    if (preview) {
      avatarFile = acceptedFiles[0];
    }
    handleCreateGroup({
      name,
      participants,
      avatarFile,
    });
  };
  return (
    <form
      id="create-group-form"
      onSubmit={handleSubmit}
      className="z-10 border-b"
    >
      <div className="flex items-center gap-3 space-y-1 px-3 py-2">
        {preview ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar
                size="lg"
                src={preview}
                alt={selectedUsers[0]?.name}
                className="ring-2 ring-background"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[280px] rounded-xl p-0"
            >
              <div className="px-3 py-2 font-semibold">Change group avatar</div>
              <DropdownMenuItem className="h-12" onClick={open}>
                Replace
              </DropdownMenuItem>
              <DropdownMenuItem
                className="h-12"
                onClick={() => {
                  setPreview(undefined);
                }}
              >
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button.Icon
              color="default"
              onClick={open}
              type="button"
              className="shrink-0"
            >
              <CameraIcon />
            </Button.Icon>

            <input
              {...getInputProps()}
              ref={inputRef}
              name="avatar"
              type="file"
              className="hidden"
            />
          </>
        )}

        <input
          placeholder="Group name (optional)"
          name="name"
          className="flex-1 border-none px-0 outline-none ring-0 focus:border-none focus:outline-none focus:ring-offset-0 focus-visible:ring-0"
        />
      </div>
      <div className="z-10 items-center gap-2 space-y-1 px-3 py-2 pb-3">
        <SearchInput
          className="flex-1"
          onChange={(e) =>
            setSearchTerm(e.currentTarget.value.toLocaleLowerCase())
          }
          placeholder="Search"
        />
        <SelectedList items={selectedUsers} onItemClick={handleUnSelectUser} />
      </div>
    </form>
  );
};
