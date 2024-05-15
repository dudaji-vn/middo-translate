'use client';

import React, { useEffect, useState } from 'react';
import 'reactflow/dist/style.css';

import { Button } from '@/components/actions';
import { Smile } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useFormContext } from 'react-hook-form';
import {
  useMediaUpload,
} from '@/components/media-upload';
import { MessageEditorToolbarFile } from '@/features/chat/messages/components/message-editor/message-editor-toolbar-file';
import { useTranslation } from 'react-i18next';
import {
  AttachmentSelection,
} from '@/components/attachment-selection';
import { useAppStore } from '@/stores/app.store';
import { Popover, PopoverTrigger } from '@/components/data-display/popover';
import { PopoverContent } from '@radix-ui/react-popover';
import Picker from '@emoji-mart/react';

const allowedMediaTypes: Record<string, string> = {
  image: 'image',
  video: 'video',
  document: 'document',
};
const NodeMessageToolbar = ({
  nameFieldImg = '',
  nameFiledContent = '',
}: {
  nameFieldImg: string;
  nameFiledContent: string;
}) => {
  const { t } = useTranslation('common');
  const { files, uploadedFiles } = useMediaUpload();
  const { setValue, watch } = useFormContext();
  const isMobile = useAppStore((state) => state.isMobile);
  const [openEmojisPicker, setOpenEmojisPicker] = useState(false);

  useEffect(() => {
    if (uploadedFiles) {
      const media = uploadedFiles.map((file) => ({
        ...file,
        type:
          allowedMediaTypes[file.file?.type?.split('/')[0] as string] ||
          'document',
      }));
      setValue(nameFieldImg, media);
    }
  }, [uploadedFiles, files, setValue, nameFieldImg]);

  return (
    <>
      <div className="flex flex-col">
        <AttachmentSelection />
        <div className="flex flex-row">
          <MessageEditorToolbarFile />
          <Popover open={openEmojisPicker} onOpenChange={setOpenEmojisPicker}>
            <PopoverTrigger asChild>
              <Button.Icon variant="ghost" color="default" size="xs">
                <Smile />
              </Button.Icon>
            </PopoverTrigger>
            <PopoverContent
              sideOffset={isMobile ? 14 : 24}
              alignOffset={isMobile ? 0 : -14}
              align="start"
              className={cn(
                'w-fit border-none !bg-transparent p-0 shadow-none',
                isMobile && 'w-screen',
              )}
            >
              <Picker
                theme="light"
                onEmojiSelect={(emoji: any) => {
                  const text = watch(nameFiledContent);
                  setValue(nameFiledContent, text + emoji.native);
                }}
                skinTonePosition="none"
                previewPosition="none"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
};

export default NodeMessageToolbar;
