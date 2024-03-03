'use client';

import { Button, useCapture } from '@/components/actions';

import { CopyImgIcon } from '@/components/icons';
import { forwardRef } from 'react';
import { useCompare } from '@/features/translate/context';
import { useTranslateStore } from '@/stores/translate.store';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';

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
          variant="ghost"
          color="primary"
          size="lg"
        >
          <CopyImgIcon />
        </Button.Icon>
      </div>
    );
  },
);
ImgCopy.displayName = 'ImgCopy';
