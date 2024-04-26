'use client';

import { Button, useCapture } from '@/components/actions';

import { useCompare } from '@/features/translate/context';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { useTranslateStore } from '@/stores/translate.store';
import { SHORTCUTS } from '@/types/shortcuts';
import { ImagesIcon } from 'lucide-react';
import { forwardRef } from 'react';

export interface ImgCopyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ImgCopy = forwardRef<HTMLDivElement, ImgCopyProps>(
  (props, ref) => {
    const { onCapture } = useCapture();
    const { isEnglishTranslate } = useTranslateStore();
    const { isMatch } = useCompare();
    useKeyboardShortcut([SHORTCUTS.COPY_IMAGE], () => {
      if (isMatch && !isEnglishTranslate) {
        onCapture();
      }
    });
    return (
      <div ref={ref} {...props}>
        <Button.Icon
          disabled={!isMatch || isEnglishTranslate}
          onClick={onCapture}
          variant="default"
          color="secondary"
          size="sm"
        >
          <ImagesIcon />
        </Button.Icon>
      </div>
    );
  },
);
ImgCopy.displayName = 'ImgCopy';
