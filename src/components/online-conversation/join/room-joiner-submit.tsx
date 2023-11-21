'use client';

import { forwardRef, useEffect, useState } from 'react';
import {
  removeOnlineConversionInfo,
  setOnlineConversionInfo,
} from '@/utils/local-storage';

import { Button } from '../../button';
import Link from 'next/link';
import { LoadingBase } from '@/components/loading-base';
import { ROUTE_NAMES } from '@/configs/route-name';
import { createParticipant } from '@/utils/conversation';
import socket from '@/lib/socket-io';
import { useConversationStore } from '@/stores/conversation';
import { useRoomJoiner } from '@/components/online-conversation/join/room-joiner-context';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/stores/session';
import { useToast } from '../../toast';

export interface RoomJoinerSubmitProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const RoomJoinerSubmit = forwardRef<
  HTMLDivElement,
  RoomJoinerSubmitProps
>((props, ref) => {
  const { setInfo } = useConversationStore();
  const { isValid, selectedNativeLanguage, username, room, hasRememberedInfo } =
    useRoomJoiner();
  const [isCreating, setIsCreating] = useState(false);
  const [isRemember, setIsRemember] = useState(hasRememberedInfo);
  const router = useRouter();
  const { sessionId } = useSessionStore();
  const { toast } = useToast();
  const handleSubmit = async () => {
    setIsCreating(true);
    try {
      const user = createParticipant({
        username,
        language: selectedNativeLanguage,
        socketId: sessionId,
      });

      if (isRemember) {
        setOnlineConversionInfo({
          username,
          selectedNativeLanguage,
        });
      } else {
        removeOnlineConversionInfo();
      }
      setInfo({
        color: user.color,
        language: user.language,
        username: user.username,
        socketId: socket.id,
      });
      router.push(ROUTE_NAMES.ONLINE_CONVERSATION + '/' + room.code);
    } catch (error) {
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
      <div className="formField checkBox -mt-5">
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
          className="fillButton create w-full"
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
