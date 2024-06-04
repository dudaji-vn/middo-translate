import { SOCKET_CONFIG } from '@/configs/socket';
import socket from '@/lib/socket-io';
import Image from 'next/image';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import IDrawDoodle from '../interfaces/draw-doodle.interface';
import { useDoodleContext } from '../context/doodle-context-context';
import { User } from '@/features/users/types';

interface ImageParticipantsProps {
  width: number;
  height: number;
}
const ImageParticipants = ({ width, height }: ImageParticipantsProps) => {
  const { imagesCanvas, setImagesCanvas } = useDoodleContext();
  const imagesCanvasArray = useMemo(() => {
    return Object.values(imagesCanvas).map((item) => item.image);
  }, [imagesCanvas]);

  const listenSomeoneDrawDoodle = useCallback(
    async (payload: IDrawDoodle) => {
      if (payload.socketId === socket.id) return;
      const currentImagesCanvas = { ...imagesCanvas };
      currentImagesCanvas[payload.socketId] = {
        user: payload.user,
        image: payload.image,
        color: payload.color,
      };
      setImagesCanvas(currentImagesCanvas);
    },
    [imagesCanvas, setImagesCanvas],
  );

  const listenOldDoodleImage = useCallback(
    async (
      payload: Record<string, { user: User; image: string; color: string }>,
    ) => {
      const currentImagesCanvas = { ...imagesCanvas };
      for (const [key, value] of Object.entries(payload)) {
        if (key === socket.id) continue;
        currentImagesCanvas[key] = value;
      }
      setImagesCanvas(currentImagesCanvas);
    },
    [imagesCanvas, setImagesCanvas],
  );

  useEffect(() => {
    // Event draw doodle
    socket.on(SOCKET_CONFIG.EVENTS.CALL.DRAW_DOODLE, listenSomeoneDrawDoodle);
    // Event receive doodle
    socket.on(
      SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_OLD_DOODLE_DATA,
      listenOldDoodleImage,
    );

    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.CALL.DRAW_DOODLE);
      socket.off(SOCKET_CONFIG.EVENTS.CALL.REQUEST_GET_OLD_DOODLE_DATA);
    };
  }, [listenOldDoodleImage, listenSomeoneDrawDoodle]);

  return (
    <>
      {imagesCanvasArray.map(
        (src: string, index: number) =>
          src && (
            <div
              key={index}
              style={{ width: `${width}px`, height: `${height}px` }}
              className="absolute bottom-1/2 right-1/2 z-[9] translate-x-1/2 translate-y-1/2 bg-transparent"
            >
              <Image
                width={1000}
                height={1000}
                src={src}
                alt="Image"
                className="h-full w-full object-cover"
              />
            </div>
          ),
      )}
    </>
  );
};

export default memo(ImageParticipants);
