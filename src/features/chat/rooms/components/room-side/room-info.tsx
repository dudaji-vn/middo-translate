'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/feedback';
import {
  InputCropImage,
  InputCropImageRef,
} from '@/components/form/InputCropImage';
import { getCountryCode, getLanguageByCode } from '@/utils/language-fn';
import { useMemo, useRef, useState } from 'react';

import { Camera } from 'lucide-react';
import { CircleFlag } from 'react-circle-flags';
import { Room } from '@/features/chat/rooms/types';
import { RoomAvatar } from '../room-avatar';
import { RoomUpdateAvatar } from './room-update-avatar';
import { RoomUpdateName } from './room-update-name';
import { generateRoomDisplay } from '../../utils';
import { toast } from '@/components/toast';
import { uploadImage } from '@/utils/upload-img';
import { useAuthStore } from '@/stores/auth';

export interface RoomInfoProps {
  room: Room;
}

export const RoomInfo = ({ room: _room }: RoomInfoProps) => {
  const user = useAuthStore((state) => state.user);

  const { room, language } = useMemo(() => {
    const room = generateRoomDisplay(_room, user?._id || '');
    const others = room.participants.filter(
      (member) => member._id !== user?._id,
    );
    const languageCode =
      others.length > 0 ? others[0].language : user?.language;
    const languageName = getLanguageByCode(languageCode || 'en')?.name;
    const countryCode = getCountryCode(languageCode || 'en');
    const language = {
      name: languageName,
      code: languageCode,
      countryCode,
    };
    return {
      room,
      language,
    };
  }, [_room, user?._id, user?.language]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputCropImage = useRef<InputCropImageRef>(null);

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = inputCropImage.current?.getCropData();
    if (!file) {
      toast({ title: 'Error', description: 'Please choose your image!' });
      return;
    }
    try {
      setLoading(true);
      let image = await uploadImage(file);
      let imgUrl = image.secure_url;
      if (!imgUrl) throw new Error('Upload image failed!');
      toast({ title: 'Success', description: 'Your avatar has been update!' });
      setOpen(false);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <RoomAvatar room={room} />
      <p className=" mt-3 font-medium">{room.name}</p>
      {!room.isGroup ? (
        <div className="mt-2 flex items-center gap-2 rounded-xl bg-background-darker p-2">
          <CircleFlag
            countryCode={language.countryCode?.toLowerCase() || 'gb'}
            height={20}
            width={20}
          />
          <span className="">{language.name}</span>
        </div>
      ) : (
        <div className="mt-4 flex gap-6">
          <RoomUpdateName />
          <RoomUpdateAvatar />
        </div>
      )}
    </div>
  );
};
