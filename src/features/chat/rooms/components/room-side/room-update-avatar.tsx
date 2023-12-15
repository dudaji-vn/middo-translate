import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';

import { Button } from '@/components/actions';
import { Camera } from 'lucide-react';
import { toast } from '@/components/toast';
import { uploadImage } from '@/utils/upload-img';
import { useChatBox } from '../../contexts';
import { useDropzone } from 'react-dropzone';
import { useUpdateRoomInfo } from '../../hooks/use-update-room-info';

export interface RoomUpdateAvatarProps {
  initialAvatar?: string;
  onUploading?: () => void;
  onUploaded?: () => void;
}

export const RoomUpdateAvatar = ({
  initialAvatar,
  onUploading,
  onUploaded,
}: RoomUpdateAvatarProps) => {
  const { mutateAsync } = useUpdateRoomInfo();
  const { room } = useChatBox();
  const { getInputProps, open, inputRef } = useDropzone({
    noClick: true,
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxSize: 3 * 1024 * 1024, // 3MB
    onDropAccepted: async (files) => {
      const file = files[0];
      onUploading?.();
      const avatar = await uploadImage(file);
      await mutateAsync({
        roomId: room._id,
        data: {
          avatar: avatar.secure_url,
        },
      });
      onUploaded?.();

      // call api to update avatar, tomorrow
    },
    onDropRejected: () => {
      toast({
        title: 'Error',
        description: 'Please choose image with size less than 3MB!',
      });
    },
  });

  return (
    <div>
      {initialAvatar ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button.Icon
              color="secondary"
              onClick={open}
              type="button"
              className="shrink-0"
            >
              <Camera />
            </Button.Icon>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            className="w-[280px] rounded-xl p-0"
          >
            <div className="px-3 py-2 font-semibold">Change group avatar</div>
            <DropdownMenuItem className="h-12" onClick={open}>
              Replace
            </DropdownMenuItem>
            <DropdownMenuItem className="h-12">Remove</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <div>
            <Button.Icon
              color="secondary"
              onClick={open}
              type="button"
              className="shrink-0"
            >
              <Camera />
            </Button.Icon>
          </div>

          <input
            {...getInputProps()}
            ref={inputRef}
            name="avatar"
            type="file"
            className="hidden"
          />
        </>
      )}
    </div>
  );
};
