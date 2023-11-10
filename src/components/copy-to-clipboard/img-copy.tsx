'use client';

import { CopyImgIcon } from '../icons';
import { IconButton } from '../button';
import Image from 'next/image';
import { forwardRef } from 'react';
import { useCapture } from '../capture';
import { useCompare } from '../compare';
import { useTranslateStore } from '@/stores/translate';

export interface ImgCopyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ImgCopy = forwardRef<HTMLDivElement, ImgCopyProps>(
  (props, ref) => {
    const { onCapture } = useCapture();
    const { isEnglishTranslate } = useTranslateStore();
    const { isMatch } = useCompare();
    return (
      <div ref={ref} {...props}>
        <IconButton
          disabled={!isMatch || isEnglishTranslate}
          onClick={onCapture}
          variant="ghostPrimary"
        >
          <CopyImgIcon className="h-7 w-7" />
        </IconButton>
      </div>
    );
  },
);
ImgCopy.displayName = 'ImgCopy';
