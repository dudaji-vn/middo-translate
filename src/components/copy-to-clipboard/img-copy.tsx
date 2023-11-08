import Image from 'next/image';
import { forwardRef } from 'react';
export interface ImgCopyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ImgCopy = forwardRef<HTMLDivElement, ImgCopyProps>(
  (props, ref) => {
    return (
      <div ref={ref} {...props}>
        <button className="circleButton big !bg-transparent active:!bg-lighter">
          <Image width={20} height={20} src="/img-copy.svg" alt="copy" />
        </button>
      </div>
    );
  },
);
ImgCopy.displayName = 'ImgCopy';
