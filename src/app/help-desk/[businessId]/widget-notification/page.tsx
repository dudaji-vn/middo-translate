'use client';

import { MessagesSquare } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import NewMessageCatcher from './_components/NewMessageCatcher';
import { LSK_VISITOR_ID, LSK_VISITOR_ROOM_ID } from '@/types/business.type';
import { useGetRoomData } from '@/features/business-spaces/hooks/use-get-chat-room';
import { isEmpty } from 'lodash';

const EmbedButtonPage = () => {
  const [anonymous, setAnonymous] = useState();
  const [roomId, setRoomId] = useState<string>('');
  const [visitorId, setVisitorId] = useState<string>('');
  const [idsFound, setIdsFound] = useState<boolean>(false);
  const { data: room } = useGetRoomData({ roomId, userId: visitorId });

  const checkTheLocalStorage = () => {
    const rId = localStorage.getItem(LSK_VISITOR_ROOM_ID);
    const vId = localStorage.getItem(LSK_VISITOR_ID);
    console.log('checkTheLocalStorage', rId, vId);
    if (rId && vId) {
      setRoomId(rId);
      setVisitorId(vId);
      setIdsFound(true); // Stop checking once IDs are found
    }
  };
  const onRoomEnd = () => {
    console.log('onRoomEnd');
    setAnonymous(undefined);
    setRoomId('');
    setVisitorId('');
    setIdsFound(false);
  };

  useEffect(() => {
    if (isEmpty(room?.data)) return;
    const anonymousUser = room?.data?.participants?.find(
      (e: any) => e.status === 'anonymous',
    );
    setAnonymous(anonymousUser);
  }, [room]);

  useEffect(() => {
    if (typeof document !== 'undefined')
      document.body.style.background = 'transparent';

    if (!idsFound) {
      const intervalId = setInterval(checkTheLocalStorage, 7000);
      return () => clearInterval(intervalId);
    }
  }, [idsFound]);

  return (
    <div className="fixed inset-0 flex h-screen w-screen flex-row items-end justify-end bg-transparent">
      <button
        onClick={() => {
          console.log('checkTheLocalStorage');
          checkTheLocalStorage();
        }}
        className="relative mb-7 mr-7 w-fit rounded-full bg-white p-4 shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)]"
      >
        {anonymous && room && (
          <NewMessageCatcher
            room={room?.data}
            anonymousUser={anonymous}
            onRoomEnd={onRoomEnd}
          />
        )}
        <MessagesSquare className="h-8 w-8 stroke-primary-500-main" />
      </button>
    </div>
  );
};

export default EmbedButtonPage;
