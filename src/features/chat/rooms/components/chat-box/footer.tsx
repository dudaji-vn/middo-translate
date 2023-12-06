'use client';

import { MicOutline, PaperPlaneOutline } from '@easy-eva-icons/react';

import { AdditionalActions } from './additional-actions';
import { Button } from '@/components/actions/button';
import { FileList } from './file-list';
import { forwardRef } from 'react';
import useAuthStore from '@/features/auth/stores/use-auth-store';
import { useSelectFiles } from '../../hooks/use-select-files';

type FileWithUrl = {
  url: string;
  file: File;
};

export interface ChatBoxFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const ChatBoxFooter = forwardRef<HTMLDivElement, ChatBoxFooterProps>(
  (props, ref) => {
    const currentUser = useAuthStore((s) => s.user);
    const {
      files,
      getInputProps,
      getRootProps,
      open,
      removeFile,
      handlePasteFile,
    } = useSelectFiles();

    // const { mutateAsync } = useMutation({
    //   mutationFn: messageApi.sendMessage,
    //   onSuccess: (data, variables) => {
    //     // replaceMessage(data, variables.clientTempId);
    //   },
    // });

    // const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    //   const items = e.clipboardData.items;
    //   const files = Array.from(items)
    //     .filter((item) => item.kind === 'file')
    //     .map((item) => item.getAsFile());
    //   const newFiles = files.map((file) => ({
    //     url: URL.createObjectURL(file!),
    //     file: file!,
    //   }));
    //   setFiles((old) => [...old, ...newFiles]);
    // };
    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //   e.preventDefault();

    //   const formData = new FormData(e.currentTarget);
    //   const content = formData.get('message') as string;
    //   const images: Media[] = [];
    //   const documents: Media[] = [];
    //   for (const file of files) {
    //     if (file.file.type.startsWith('image')) {
    //       images.push({
    //         url: file.url,
    //         type: 'image',
    //         file: file.file,
    //         name: file.file.name,
    //         size: file.file.size,
    //       });
    //     } else {
    //       documents.push({
    //         url: file.url,
    //         type: 'document',
    //         file: file.file,
    //         name: file.file.name,
    //         size: file.file.size,
    //       });
    //     }
    //   }
    //   e.currentTarget.reset();
    //   setFiles([]);
    //   let roomId = room._id;

    //   if (room.status === 'temporary') {
    //     const res = await roomApi.createRoom({
    //       participants: room.participants.map((p) => p._id),
    //     });
    //     roomId = res._id;
    //     updateRoom(res);
    //   }

    //   if (content) {
    //     const localMessage = createLocalMessage({
    //       sender: currentUser!,
    //       content,
    //     });
    //     addMessage(localMessage);
    //     mutateAsync({
    //       content,
    //       roomId,
    //       clientTempId: localMessage._id,
    //     });
    //   }

    //   if (images.length) {
    //     const localImageMessage = createLocalMessage({
    //       sender: currentUser!,
    //       media: images,
    //     });
    //     addMessage(localImageMessage);
    //     const imagesUploaded: Media[] = await Promise.all(
    //       images.map(async (img) => {
    //         const res = await uploadImage(img.file!);
    //         return {
    //           url: res.secure_url,
    //           type: 'image',
    //         };
    //       }),
    //     );

    //     mutateAsync({
    //       content: '',
    //       roomId,
    //       clientTempId: localImageMessage._id,
    //       media: imagesUploaded,
    //     });
    //   }
    //   if (documents.length) {
    //     const localDocumentMessages = documents.map((doc) => {
    //       const localDocumentMessage = createLocalMessage({
    //         sender: currentUser!,
    //         media: [doc],
    //       });
    //       addMessage(localDocumentMessage);
    //       return localDocumentMessage;
    //     });
    //     Promise.all(
    //       localDocumentMessages.map(async (message, index) => {
    //         const res = await uploadImage(documents[index].file!);
    //         mutateAsync({
    //           content: '',
    //           roomId,
    //           clientTempId: message._id,
    //           media: [
    //             {
    //               ...documents[index],
    //               url: res.secure_url,
    //             },
    //           ],
    //         });
    //       }),
    //     );
    //   }
    // };
    return (
      <div className="w-full bg-background-lightest px-5 py-4">
        <form
          {...getRootProps()}
          // onSubmit={handleSubmit}
          className="flex w-full items-center gap-2 "
        >
          <input {...getInputProps()} hidden />
          <div className="min-h-[3.75rem] flex-1 items-center gap-2 rounded-[1.25rem] border border-primary bg-card p-2 shadow-sm transition-all">
            <div className="flex flex-1">
              <AdditionalActions onOpenSelectFiles={open} />
              <input
                autoComplete="off"
                onPaste={handlePasteFile}
                name="message"
                type="text"
                className="flex-1 bg-transparent outline-none"
                placeholder="Type a message"
              />
              <div className="h-full items-end">
                <Button.Icon
                  variant="ghost"
                  className="self-end"
                  color="default"
                >
                  <MicOutline />
                </Button.Icon>

                {
                  <Button.Icon
                    variant="ghost"
                    color="primary"
                    className="self-end"
                  >
                    <PaperPlaneOutline />
                  </Button.Icon>
                }
              </div>
            </div>
            <FileList
              onAddMoreFiles={open}
              files={files}
              onRemoveFile={removeFile}
            />
          </div>
        </form>
      </div>
    );
  },
);
ChatBoxFooter.displayName = 'ChatBoxFooter';
