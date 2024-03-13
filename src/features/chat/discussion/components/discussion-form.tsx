import { useMutation } from '@tanstack/react-query';
import {
  MessageEditor,
  MessageEditorSubmitData,
} from '../../messages/components/message-editor-v2';
import { messageApi } from '../../messages/api';
import { useDiscussion } from './discussion';
import { createLocalMessage } from '../../messages/utils';
import { useAuthStore } from '@/stores/auth.store';
import { useEffect, useState } from 'react';
import { Message } from '../../messages/types';
import { useMediaUpload } from '@/components/media-upload';
import { Media } from '@/types';

export interface DiscussionFormProps {}

export const DiscussionForm = (props: DiscussionFormProps) => {
  const currentUser = useAuthStore((s) => s.user);
  const { uploadedFiles } = useMediaUpload();
  const [localImageMessageWaiting, setLocalImageMessageWaiting] =
    useState<Message | null>(null);

  const [localDocumentMessagesWaiting, setLocalDocumentMessagesWaiting] =
    useState<Message[]>([]);

  const { message, addReply } = useDiscussion();
  const { mutateAsync } = useMutation({
    mutationFn: messageApi.reply,
  });
  const handleSendText = async (
    content: string,
    contentEnglish?: string,
    language?: string,
  ) => {
    const localMessage = createLocalMessage({
      sender: currentUser!,
      content,
      contentEnglish,
      language,
    });
    addReply(localMessage);
    mutateAsync({
      repliedMessageId: message._id,
      message: {
        content,
        contentEnglish,
        language,
        roomId: message?.room?._id!,
      },
    });
  };
  const handleSubmit = async (data: MessageEditorSubmitData) => {
    const { content, images, documents, contentEnglish, language } = data;

    const trimContent = content.trim();

    if (trimContent) {
      handleSendText(content, contentEnglish, language);
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
          roomId: message?.room?._id!,

          media: imagesUploaded,
        },
      });
      setLocalImageMessageWaiting(null);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [localImageMessageWaiting, uploadedFiles, message.room?._id],
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
            roomId: message?.room?._id!,
            media: documentsUploaded[index],
          },
        });
      }),
    );
    setLocalDocumentMessagesWaiting([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localDocumentMessagesWaiting, uploadedFiles, message.room?._id]);

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
