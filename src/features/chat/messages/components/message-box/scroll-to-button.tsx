import { SOCKET_CONFIG } from '@/configs/socket';
import { roomApi } from '@/features/chat/rooms/api';
import socket from '@/lib/socket-io';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/actions';
import { ArrowDownIcon } from 'lucide-react';

export const ScrollToButton = ({
  roomId,
  handleScrollToBottom,
}: {
  roomId: string;
  handleScrollToBottom: () => void;
}) => {
  const { data, refetch } = useQuery({
    queryKey: ['count-unread-messages', { roomId }],
    queryFn: () => roomApi.countUnreadMessages(roomId),
  });
  const { mutate } = useMutation({
    mutationFn: () => roomApi.markAsRead(roomId),
    onSuccess(data, variables, context) {
      refetch();
    },
  });
  const newCount = data?.count ?? 0;

  useEffect(() => {
    socket.on(SOCKET_CONFIG.EVENTS.MESSAGE.UNREAD_UPDATE, () => {
      refetch();
    });
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.MESSAGE.UNREAD_UPDATE);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleClick = () => {
    if (newCount > 0) {
      mutate();
    }
    handleScrollToBottom();
  };
  return (
    <>
      {newCount === 0 ? (
        <motion.div layoutId="new-message-button">
          <Button.Icon
            size="xs"
            color="secondary"
            onClick={handleScrollToBottom}
            className="absolute bottom-4 left-1/2 -translate-x-1/2"
          >
            <ArrowDownIcon className="text-primary" />
          </Button.Icon>
        </motion.div>
      ) : (
        <motion.div layoutId="new-message-button">
          <Button
            onClick={handleClick}
            startIcon={<ArrowDownIcon />}
            size="xs"
            color="secondary"
            className="absolute bottom-4 left-1/2 -translate-x-1/2"
          >
            {newCount} New messages
          </Button>
        </motion.div>
      )}
    </>
  );
};
