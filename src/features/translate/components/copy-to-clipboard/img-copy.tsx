'use client';

import { Button } from '@/components/actions';
import { CopyImgIcon } from '../../../../components/icons';
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
