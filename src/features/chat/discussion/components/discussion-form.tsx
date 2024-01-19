import { useMutation } from '@tanstack/react-query';
import {
  MessageEditor,
  MessageEditorSubmitData,
} from '../../messages/components/message-editor';
import { messageApi } from '../../messages/api';
import { useDiscussion } from './discussion';

export interface DiscussionFormProps {}

export const DiscussionForm = (props: DiscussionFormProps) => {
  const { message } = useDiscussion();
  const { mutate } = useMutation({
    mutationFn: messageApi.reply,
  });
  const handleSendText = async (
    content: string,
    contentEnglish?: string,
    language?: string,
  ) => {
    mutate({
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

    if (content) {
      handleSendText(content, contentEnglish, language);
    }

    // if (images.length) {
    //   const localImageMessage = createLocalMessage({
    //     sender: currentUser!,
    //     media: images,
    //   });
    //   addMessage(localImageMessage);
    //   setLocalImageMessageWaiting(localImageMessage);
    // }
    // if (documents.length) {
    //   const localDocumentMessages = documents.map((doc) => {
    //     const localDocumentMessage = createLocalMessage({
    //       sender: currentUser!,
    //       media: [doc],
    //     });
    //     addMessage(localDocumentMessage);
    //     return localDocumentMessage;
    //   });
    //   setLocalDocumentMessagesWaiting(localDocumentMessages);
    // }
  };
  return (
    <div className="-mx-3 border-t px-3 pt-1">
      <MessageEditor
        onSubmitValue={handleSubmit}
        // onFileUploaded={setFilesUploaded}
      />
    </div>
  );
};
