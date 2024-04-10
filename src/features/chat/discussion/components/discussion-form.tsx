import { useMutation } from '@tanstack/react-query';
import { messageApi } from '../../messages/api';
import { useDiscussion } from './discussion';
import { createLocalMessage } from '../../messages/utils';
import { useAuthStore } from '@/stores/auth.store';
import { useEffect, useState } from 'react';
import { Message } from '../../messages/types';
import { useMediaUpload } from '@/components/media-upload';
import { Media } from '@/types';
import {
  MessageEditor,
  MessageEditorSubmitData,
} from '@/components/message-editor';

export interface DiscussionFormProps {}

export const DiscussionForm = (props: DiscussionFormProps) => {
  const currentUser = useAuthStore((s) => s.user);
  const { uploadedFiles } = useMediaUpload();
  const [localImageMessageWaiting, setLocalImageMessageWaiting] =
    useState<Message | null>(null);

  const [localDocumentMessagesWaiting, setLocalDocumentMessagesWaiting] =
    useState<Message[]>([]);
  const [localVideoMessageWaiting, setLocalVideoMessageWaiting] = useState<
    Message[]
  >([]);

  const { message, addReply } = useDiscussion();
  const roomId = message?.room?._id;
  const { mutateAsync } = useMutation({
    mutationFn: messageApi.reply,
  });
  const handleSendText = async ({
    content,
    language,
    mentions,
  }: {
    content: string;
    language?: string;
    mentions?: string[];
  }) => {
    const localMessage = createLocalMessage({
      sender: currentUser!,
      content,
      language,
    });
    addReply(localMessage);
    mutateAsync({
      repliedMessageId: message._id,
      message: {
        content,
        language,
        roomId: message?.room?._id!,
        mentions,
      },
    });
  };
  const handleSubmit = async (data: MessageEditorSubmitData) => {
    const { content, images, documents, language, videos, mentions } = data;

    const trimContent = content.trim();

    if (trimContent) {
      handleSendText({
        content: trimContent,
        language,
        mentions,
      });
    }

    if (images.length) {
      const localImageMessage = createLocalMessage({
        sender: currentUser!,
        media: images,
      });
      addReply(localImageMessage);
      setLocalImageMessageWaiting(localImageMessage);
    }
    if (documents.length) {
      const localDocumentMessages = documents.map((doc) => {
        const localDocumentMessage = createLocalMessage({
          sender: currentUser!,
          media: [doc],
        });
        addReply(localDocumentMessage);
        return localDocumentMessage;
      });
      setLocalDocumentMessagesWaiting(localDocumentMessages);
    }

    if (videos.length) {
      const localVideoMessages = videos.map((video) => {
        const localVideoMessage = createLocalMessage({
          sender: currentUser!,
          media: [video],
        });
        addReply(localVideoMessage);
        return localVideoMessage;
      });
      setLocalVideoMessageWaiting(localVideoMessages);
    }
  };

  useEffect(
    () => {
      if (!localImageMessageWaiting || !uploadedFiles.length) return;
      const localImages = localImageMessageWaiting.media;
      if (!localImages) return;
      const imagesUploaded: Media[] = localImages.map((item) => {
        const file = uploadedFiles.find((f) => f.localUrl === item.url);
        if (file) {
          return {
            ...item,
            url: file.metadata.secure_url || file.url,
            width: file.metadata.width,
            height: file.metadata.height,
          };
        }
        return item;
      });
      mutateAsync({
        repliedMessageId: message._id,
        message: {
          content: '',
          roomId: roomId!,

          media: imagesUploaded,
        },
      });
      setLocalImageMessageWaiting(null);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [localImageMessageWaiting, uploadedFiles, roomId],
  );

  useEffect(() => {
    if (!localDocumentMessagesWaiting.length || !uploadedFiles.length) return;
    const localDocumentMessages = localDocumentMessagesWaiting;
    const documentsUploaded: Media[][] = localDocumentMessages.map(
      (message) => {
        const localDocuments = message.media;
        if (!localDocuments) return [];
        const documentsUploaded: Media[] = localDocuments.map((item) => {
          const file = uploadedFiles.find((f) => f.localUrl === item.url);
          if (file) {
            return {
              ...item,
              url: file.metadata.secure_url || file.url,
            };
          }
          return item;
        });
        return documentsUploaded;
      },
    );
    Promise.all(
      localDocumentMessages.map(async (docMessage, index) => {
        mutateAsync({
          repliedMessageId: message._id,
          message: {
            content: '',
            roomId: roomId!,
            media: documentsUploaded[index],
          },
        });
      }),
    );
    setLocalDocumentMessagesWaiting([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localDocumentMessagesWaiting, uploadedFiles, roomId]);

  useEffect(() => {
    if (!localVideoMessageWaiting.length || !uploadedFiles.length) return;
    const localVideoMessages = localVideoMessageWaiting;
    const videosUploaded: Media[][] = localVideoMessages.map((message) => {
      const localVideos = message.media;

      if (!localVideos) return [];
      const VideosUploaded: Media[] = localVideos.map((item) => {
        const file = uploadedFiles.find((f) => f.localUrl === item.url);
        if (file) {
          return {
            ...item,
            url: file.metadata.secure_url || file.url,
          };
        }
        return item;
      });
      return VideosUploaded;
    });
    Promise.all(
      localVideoMessages.map(async (videoMessage, index) => {
        mutateAsync({
          repliedMessageId: message._id,
          message: {
            content: '',
            roomId: roomId!,
            media: videosUploaded[index],
          },
        });
      }),
    );
    setLocalVideoMessageWaiting([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localVideoMessageWaiting, uploadedFiles, roomId]);

  const room = message.room;
  return (
    <div className="border-t p-2">
      <MessageEditor
        userMentions={room?.isGroup ? room.participants : []}
        onSubmitValue={handleSubmit}
      />
    </div>
  );
};
