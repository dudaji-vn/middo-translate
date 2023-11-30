'use client';

import { forwardRef } from 'react';
import { useCapture } from './capture-context';
export interface CaptureZoneProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CaptureZone = forwardRef<HTMLDivElement, CaptureZoneProps>(
  (props, ref) => {
    const { captureRef } = useCapture();
    return (
      <div ref={captureRef} {...props}>
        {props.children}
      </div>
    );
  },
);
CaptureZone.displayName = 'CaptureZone';
