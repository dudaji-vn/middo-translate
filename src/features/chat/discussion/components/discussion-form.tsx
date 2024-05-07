import {
  MessageEditor,
  MessageEditorSubmitData,
} from '@/components/message-editor';
import { useAuthStore } from '@/stores/auth.store';
import { useSendImageMessage } from '../../messages/hooks/use-send-image-message';
import { useSendMediaMessages } from '../../messages/hooks/use-send-media-messages';
import { useSendTextMessage } from '../../messages/hooks/use-send-text-message';
import { useDiscussion } from './discussion';
import { useMemo } from 'react';
import { useMessageActions } from '../../messages/components/message-actions';

export interface DiscussionFormProps {
  scrollId: string;
}

export const DiscussionForm = ({ scrollId }: DiscussionFormProps) => {
  const currentUser = useAuthStore((s) => s.user);

  const { message, addReply, updateReply } = useDiscussion();
  const roomId = message?.room?._id || '';

  const { sendImageMessage } = useSendImageMessage({
    roomId,
    addMessage: addReply,
    parentId: message._id,
  });

  const { sendMediaMessages } = useSendMediaMessages({
    roomId,
    addMessage: addReply,
    parentId: message._id,
  });

  const { sendTextMessage } = useSendTextMessage({
    roomId,
    addMessage: addReply,
    parentId: message._id,
  });
  const handleSubmit = async (data: MessageEditorSubmitData) => {
    const {
      content,
      images,
      documents,
      language,
      videos,
      mentions,
      enContent,
    } = data;

    const trimContent = content.trim();

    if (trimContent) {
      sendTextMessage({
        content: trimContent,
        language,
        mentions,
        enContent,
        sender: currentUser!,
      });
    }

    if (images.length) {
      sendImageMessage({
        images,
        sender: currentUser!,
      });
    }
    if (documents.length) {
      sendMediaMessages({
        media: documents,
        sender: currentUser!,
        parentId: message._id,
      });
    }

    if (videos.length) {
      sendMediaMessages({
        media: videos,
        sender: currentUser!,
        parentId: message._id,
      });
    }
    const messageBox = document.getElementById(scrollId);
    setTimeout(() => {
      messageBox?.scrollTo({
        top: messageBox.scrollHeight,
      });
    }, 500);
  };

  const room = message.room;
  const { action, message: messageEditing } = useMessageActions();

  const isEdit = useMemo(() => {
    if (action !== 'edit') return false;
    if (message._id !== messageEditing?.parent?._id) return false;
    return true;
  }, [action, message._id, messageEditing?.parent]);
  return (
    <div className="border-t p-2">
      <MessageEditor
        onEditSubmit={updateReply}
        isEditing={isEdit}
        roomId={roomId + message._id}
        userMentions={room?.isGroup ? room.participants : []}
        onSubmitValue={handleSubmit}
      />
    </div>
  );
};
