import { Avatar, Text, Typography } from '@/components/data-display';
import { Spinner } from '@/components/feedback';
import { TriangleSmall } from '@/components/icons/triangle-small';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { ImageGallery } from '@/features/chat/messages/components/message-item/message-item-image-gallery';
import { User } from '@/features/users/types';
import { translateWithDetection } from '@/services/languages.service';

import { Media } from '@/types';
import { cn } from '@/utils/cn';
import React, { useEffect, useMemo } from 'react';
import { useDebounce } from 'usehooks-ts';
import { TSpace } from '../../../../_components/business-spaces';

const DEBOUNCED_TRANSLATE_TIME = 800;

export const PreviewReceivedMessage = ({
  sender,
  space,
  media,
  content = '',
  debouncedTime = DEBOUNCED_TRANSLATE_TIME,
  englishContent,
  onTranlatedChange,
  ...props
}: {
  space?: TSpace;
  sender?: User | null;
  content?: string;
  englishContent?: string;
  onTranlatedChange?: (translated: string) => void;
  debouncedTime?: number;
  media?: Media[];
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [translatedContent, setTranslatedContent] = React.useState<string>(
    englishContent || '',
  );
  const [isTranslating, setIsTranslating] = React.useState<boolean>(false);
  const debouncedContent = useDebounce(content, debouncedTime);
  const isTyping = useMemo(
    () => debouncedContent !== content,
    [debouncedContent, content],
  );

  useEffect(() => {
    if (englishContent?.length) {
      setTranslatedContent(englishContent);
      return;
    }
    setIsTranslating(true);
    translateWithDetection(debouncedContent, DEFAULT_LANGUAGES_CODE.EN)
      .then((res) => {
        setTranslatedContent(
          typeof res === 'string' ? res : res?.translatedText || '',
        );
        onTranlatedChange &&
          onTranlatedChange(
            typeof res === 'string' ? res : res?.translatedText || '',
          );
      })
      .finally(() => {
        setIsTranslating(false);
      });
  }, [debouncedContent]);

  return (
    <div
      {...props}
      className={cn('mb-1 flex w-full flex-col gap-2', props?.className)}
    >
      <div className="relative flex  w-full  gap-1 pr-11 md:pr-20">
        <div className="relative  mb-auto mr-1 mt-0.5 aspect-square size-6 shrink-0 overflow-hidden rounded-full">
          <Avatar
            variant={'outline'}
            src={space?.avatar || '/avatar.svg'}
            alt={String(sender?.email)}
            size="xs"
            className="bg-primary-200 p-1"
          />
        </div>
        <div className="max-h-[320px] overflow-y-auto">
          <div className="relative space-y-2">
            <div className="relative w-fit min-w-10 overflow-hidden rounded-[20px] bg-neutral-50 px-2 py-1">
              <div className="break-word-mt tiptap editor-view prose w-full max-w-none bg-neutral-50 px-3 py-2 text-start text-sm text-current focus:outline-none prose-strong:text-current">
                {content}
              </div>
              <div className={'relative mt-2 min-w-10'}>
                <TriangleSmall
                  fill={'#e6e6e6'}
                  position="top"
                  className="absolute left-4 top-0 -translate-y-full"
                />
                <div
                  className={cn(
                    'relative mb-1 mt-2 rounded-xl bg-neutral-100 p-1 px-3 text-neutral-600',
                  )}
                >
                  <Text
                    value={englishContent || translatedContent}
                    className={cn(
                      'text-start text-sm font-light',
                      isTyping && ' pr-4',
                    )}
                  />
                  <Spinner
                    size="sm"
                    className={
                      isTranslating || isTyping
                        ? 'absolute right-1 top-1 '
                        : 'hidden'
                    }
                    color="white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {Number(media?.length) > 0 && (
        <div className="pl-6">
          <ImageGallery images={media || []} />
        </div>
      )}
    </div>
  );
};
