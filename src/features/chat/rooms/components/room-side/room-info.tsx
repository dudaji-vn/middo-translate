'use client';

import { getCountryCode, getLanguageByCode } from '@/utils/language-fn';
import { useMemo, useState } from 'react';

import { CircleFlag } from 'react-circle-flags';
import { Room } from '@/features/chat/rooms/types';
import { RoomAvatar } from '../room-avatar';
import { RoomUpdateAvatar } from './room-update-avatar';
import { RoomUpdateName } from './room-update-name';
import { Spinner } from '@/components/feedback';
import { generateRoomDisplay } from '../../utils';
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

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {' '}
        <RoomAvatar room={room} />
        {loading && (
          <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-full bg-white bg-opacity-80">
            <Spinner className="text-primary" />
          </div>
        )}
      </div>
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
          <RoomUpdateAvatar
            onUploading={() => setLoading(true)}
            onUploaded={() => setLoading(false)}
          />
        </div>
      )}
    </div>
  );
};
