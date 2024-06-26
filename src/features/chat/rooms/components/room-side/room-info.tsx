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
import { useAuthStore } from '@/stores/auth.store';
import GuestInformation from './guest-information';
import { isEmpty } from 'lodash';
import { User } from '@/features/users/types';

export interface RoomInfoProps {
  room: Room;
  isGuest?: boolean;
}

export const RoomInfo = ({ room: _room, isGuest }: RoomInfoProps) => {
  const user = useAuthStore((state) => state.user);

  const { room, language, anonymousUser } = useMemo(() => {
    const room = generateRoomDisplay({
      room: _room,
      currentUserId: user?._id || '',
      inCludeLink: true,
    });
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
    const anonymousUser: User | null = isGuest
      ? others?.find((member) => member.status === 'anonymous') || null
      : null;
    return {
      room,
      language,
      anonymousUser,
    };
  }, [_room, isGuest, user?._id, user?.language]);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="mt-2 flex flex-col items-center">
        <div className="relative">
          <RoomAvatar room={room} size={96} />
          {loading && (
            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-full bg-white bg-opacity-80">
              <Spinner className="text-primary" />
            </div>
          )}
        </div>
        <p className=" break-word-mt mt-3 text-center font-medium">
          {room.name}
        </p>
        {!room.isGroup ? (
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-background-darker p-2 dark:bg-neutral-800">
            <CircleFlag
              countryCode={language.countryCode?.toLowerCase() || 'gb'}
              height={20}
              width={20}
            />
            <span className="text-center">{language.name}</span>
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
        {!isEmpty(anonymousUser) && (
          <GuestInformation guestData={anonymousUser} room={room} />
        )}
      </div>
    </>
  );
};
