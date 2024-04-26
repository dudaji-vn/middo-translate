import {
  MessageEditor,
  MessageEditorSubmitData,
} from '@/components/message-editor';
import { useAuthStore } from '@/stores/auth.store';
import { useSendImageMessage } from '../../messages/hooks/use-send-image-message';
import { useSendMediaMessages } from '../../messages/hooks/use-send-media-messages';
import { useSendTextMessage } from '../../messages/hooks/use-send-text-message';
import { useDiscussion } from './discussion';

export interface DiscussionFormProps {}

export const DiscussionForm = (props: DiscussionFormProps) => {
  const currentUser = useAuthStore((s) => s.user);

  const { message, addReply } = useDiscussion();
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
      });
    }

    if (videos.length) {
      sendMediaMessages({ media: videos, sender: currentUser! });
    }
  };

  const room = message.room;
  return (
    <div className="border-t p-2">
      <MessageEditor
        roomId={roomId + message._id}
        userMentions={room?.isGroup ? room.participants : []}
        onSubmitValue={handleSubmit}
      />
    </div>
  );
};
