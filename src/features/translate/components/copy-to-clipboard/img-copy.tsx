'use client';

import { CopyImgIcon } from '../../../../components/icons';
import { IconButton } from '../../../../components/button';
import Image from 'next/image';
import { forwardRef } from 'react';
import { useCapture } from '../../../../components/capture';
import { useCompare } from '../../context/compare';
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
