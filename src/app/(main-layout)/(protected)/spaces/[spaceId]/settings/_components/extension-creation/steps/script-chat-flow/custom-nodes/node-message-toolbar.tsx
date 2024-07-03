'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import 'reactflow/dist/style.css';

import { Button } from '@/components/actions';
import { Smile } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useFormContext } from 'react-hook-form';
import { useMediaUpload } from '@/components/media-upload';
import { MessageEditorToolbarFile } from '@/features/chat/messages/components/message-editor/message-editor-toolbar-file';
import { useTranslation } from 'react-i18next';
import { AttachmentSelection } from '@/components/attachment-selection';
import { useAppStore } from '@/stores/app.store';
import { Popover, PopoverTrigger } from '@/components/data-display/popover';
import { PopoverContent } from '@radix-ui/react-popover';
import Picker from '@emoji-mart/react';
import { FLOW_KEYS } from './node-types';
import { isEmpty, isEqual } from 'lodash';
import { Spinner } from '@/components/feedback';
import { Skeleton } from '@/components/ui/skeleton';

const allowedMediaTypes: Record<string, string> = {
  image: 'image',
  video: 'video',
  document: 'document',
};
const NodeMessageToolbar = ({
  readonly = false,
  mediasNameField = '',
  contentNameField = '',
}: {
  mediasNameField: string;
  contentNameField: string;
  readonly?: boolean;
}) => {
  const { t } = useTranslation('common');
  const { files, uploadedFiles, loadSavedFilesContext, removeUploadedFile } =
    useMediaUpload();
  const { setValue, watch } = useFormContext();
  const isMobile = useAppStore((state) => state.isMobile);
  const [openEmojisPicker, setOpenEmojisPicker] = useState(false);

  const currentNodeMedias = watch(mediasNameField);

  useEffect(() => {
    if (uploadedFiles) {
      const cloudUrls = uploadedFiles.map((file) => file.url).sort();
      const currentUrls = files.map((file) => file.url).sort();

      const nothingChanged = isEqual(cloudUrls, currentUrls);
      // console.log('================> \n showing files', currentUrls);
      // console.log('================> \n  uploaded to cloud files', cloudUrls);

      const media = uploadedFiles.map((file) => ({
        ...file,
        type: file.metadata.resource_type || 'document',
      }));
      setValue(mediasNameField, media);
      if (nothingChanged) return;
      if (files.length < uploadedFiles.length) {
        const fileRemoved = uploadedFiles.find(
          (file) => !currentUrls.includes(file.url),
        );
        if (fileRemoved) {
          const succes = removeUploadedFile(fileRemoved);
          console.log('file being removed:>>', succes);
        }
      }
    }
  }, [uploadedFiles, files, setValue, mediasNameField]);

  useEffect(() => {
    if (!isEmpty(currentNodeMedias)) {
      loadSavedFilesContext(currentNodeMedias);
    }
  }, []);
  const isLoading = useMemo(() => {
    return (
      currentNodeMedias?.length !== files?.length &&
      !isEmpty(files) &&
      !isEmpty(currentNodeMedias)
    );
  }, [currentNodeMedias, files]);

  return (
    <>
      <div className="flex flex-col">
        {isLoading && (
          <Skeleton className="h-1 w-full rounded-md bg-primary-200" />
        )}
        {currentNodeMedias && (
          <AttachmentSelection readonly={readonly} isLoading={isLoading} />
        )}
        <div className={cn('flex flex-row')}>
          <MessageEditorToolbarFile disabled={readonly} />
          <Popover open={openEmojisPicker} onOpenChange={setOpenEmojisPicker}>
            <PopoverTrigger asChild>
              <Button.Icon
                variant="ghost"
                color="default"
                size="xs"
                disabled={readonly}
              >
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
                disabled={readonly}
                onEmojiSelect={(emoji: any) => {
                  const text = watch(contentNameField);
                  setValue(contentNameField, text + emoji.native);
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
