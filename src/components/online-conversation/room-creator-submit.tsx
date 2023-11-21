'use client';

import { forwardRef, useEffect, useState } from 'react';
import {
  removeOnlineConversionInfo,
  setOnlineConversionInfo,
} from '@/utils/local-storage';

import { Button } from '../button';
import Link from 'next/link';
import { LoadingBase } from '../loading-base';
import { ROUTE_NAMES } from '@/configs/route-name';
import { Room } from '@/types/room';
import { createConversation } from '@/services/conversation';
import { createParticipant } from '@/utils/conversation';
import { generateUniqueUppercaseString } from '@/utils/gen-unique-uppercase-string';
import socket from '@/lib/socket-io';
import { useConversationStore } from '@/stores/conversation';
import { useRoomCreator } from './room-creator-context';
import { useRouter } from 'next/navigation';
import { useToast } from '../toast';

export interface RoomCreatorSubmitProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const RoomCreatorSubmit = forwardRef<
  HTMLDivElement,
  RoomCreatorSubmitProps
>((props, ref) => {
  const {
    isValid,
    selectedLanguages,
    selectedNativeLanguage,
    username,
    hasRememberedInfo,
  } = useRoomCreator();
  const [isCreating, setIsCreating] = useState(false);
  const [isRemember, setIsRemember] = useState(false);
  const { setInfo } = useConversationStore();
  const router = useRouter();
  const { toast } = useToast();
  const handleSubmit = async () => {
    setIsCreating(true);
    try {
      const data = {
        selectedLanguages,
        selectedNativeLanguage,
        username,
      };
      if (isRemember) {
        setOnlineConversionInfo(data);
      } else {
        removeOnlineConversionInfo();
      }

      const code = generateUniqueUppercaseString(4);
      const user = createParticipant({
        language: selectedNativeLanguage,
        socketId: socket.id,
        username: username,
      });
      const room: Room = {
        code,
        languages: selectedLanguages,
        hostSocketId: socket.id,
        participants: [user],
      };
      const newRoom = await createConversation(room);
      setInfo(user);
      router.push(ROUTE_NAMES.ONLINE_CONVERSATION_SHARE + '/' + newRoom.code);
    } catch (error) {
      console.log(error);
      toast({
        description: 'Something went wrong',
      });
    }
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
          className="fillButton create w-full md:w-auto"
          onClick={handleSubmit}
        >
          Create
        </Button>
        <Link href={ROUTE_NAMES.ONLINE_CONVERSATION}>Cancel</Link>
      </div>
      {isCreating && <LoadingBase loadingText="Creating room..." />}
    </>
  );
});
RoomCreatorSubmit.displayName = 'RoomCreatorSubmit';
