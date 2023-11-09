'use client';

import { IconButton } from '../button';
import Image from 'next/image';
import { forwardRef } from 'react';
import { useCapture } from '../capture';

export interface ImgCopyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ImgCopy = forwardRef<HTMLDivElement, ImgCopyProps>(
  (props, ref) => {
    const { onCapture } = useCapture();
    return (
      <div ref={ref} {...props}>
        <IconButton onClick={onCapture} variant="ghostPrimary">
          <Image width={20} height={20} src="/img-copy.svg" alt="copy" />
        </IconButton>
      </div>
    );
  },
);
ImgCopy.displayName = 'ImgCopy';
