'use client';

import { forwardRef, useEffect, useState } from 'react';
import {
  removeOnlineConversionInfo,
  setOnlineConversionInfo,
} from '@/utils/local-storage';

import { Button } from '../../button';
import Link from 'next/link';
import { LoadingBase } from '@/components/loading-base';
import { Participant } from '@/types/room';
import { ROUTE_NAMES } from '@/configs/route-name';
import { joinConversation } from '@/services/conversation';
import { useRoomJoiner } from '@/components/online-conversation/join/room-joiner-context';
import { useRouter } from 'next/navigation';
import { useToast } from '../../toast';

export interface RoomJoinerSubmitProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const RoomJoinerSubmit = forwardRef<
  HTMLDivElement,
  RoomJoinerSubmitProps
>((props, ref) => {
  const { isValid, selectedNativeLanguage, userName, room, hasRememberedInfo } =
    useRoomJoiner();
  const [isCreating, setIsCreating] = useState(false);
  const [isRemember, setIsRemember] = useState(hasRememberedInfo);
  const router = useRouter();
  const { toast } = useToast();
  const handleSubmit = async () => {
    setIsCreating(true);
    try {
      const user: Participant = {
        socketId: '',
        language: selectedNativeLanguage,
        username: userName,
      };

      if (isRemember) {
        setOnlineConversionInfo({
          userName,
          selectedNativeLanguage,
        });
      } else {
        removeOnlineConversionInfo();
      }

      const newRoom = await joinConversation(room.code, user);
      router.push(ROUTE_NAMES.ONLINE_CONVERSATION + '/' + newRoom.code);
    } catch (error) {
      console.log(error);
      toast({
        description: 'Something went wrong',
      });
    }
    setIsCreating(false);
  };

  useEffect(() => {
    if (hasRememberedInfo) {
      setIsRemember(true);
    } else {
      setIsRemember(false);
    }
  }, [hasRememberedInfo]);

  return (
    <>
      <div className="formField checkBox -mt-5 mb-5">
        <input
          checked={isRemember}
          onChange={(e) => setIsRemember(e.target.checked)}
          type="checkbox"
          name="UserCache"
          id="UserCache"
        />
        <label htmlFor="UserCache">Remember my information</label>
      </div>
      <div className="buttonContainer">
        <Button
          disabled={!isValid || isCreating}
          className="fillButton create"
          onClick={handleSubmit}
        >
          Enter room
        </Button>
        <Link href={ROUTE_NAMES.ONLINE_CONVERSATION}>Cancel</Link>
      </div>
      {isCreating && <LoadingBase loadingText="Entering room..." />}
    </>
  );
});
RoomJoinerSubmit.displayName = 'RoomJoinerSubmit';
