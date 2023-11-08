'use client';

import { CheckmarkCircle2Outline, Edit2Outline } from '@easy-eva-icons/react';
import {
  addAcceptDiffResult,
  getAcceptDiffResult,
} from '@/utils/local-storage';
import { forwardRef, useEffect, useMemo, useState } from 'react';

import { useSetParams } from '@/hooks/use-set-params';

export interface CompareBarProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  textCompare: string;
}

export const CompareBar = forwardRef<HTMLDivElement, CompareBarProps>(
  ({ text, textCompare, ...props }, ref) => {
    const [acceptList, setAcceptList] = useState<Record<string, string>>({});
    const { setParams } = useSetParams();
    const isMatch = useMemo(() => {
      if (acceptList[text]) return true;
      return text.toLocaleLowerCase() === textCompare.toLocaleLowerCase();
    }, [acceptList, text, textCompare]);
    const handleAccept = () => {
      addAcceptDiffResult(text, textCompare);
      setAcceptList((prev) => ({
        ...prev,
        [text]: textCompare,
      }));
    };

    const handleClickEdit = () => {
      setParams([
        {
          key: 'edit',
          value: 'true',
        },
      ]);
    };

    useEffect(() => {
      setAcceptList(getAcceptDiffResult());
    }, []);

    if (isMatch) return null;

    return (
      <div ref={ref} {...props} className="relative">
        <div className="flex justify-between">
          <button onClick={handleAccept} className="smallButton ">
            <CheckmarkCircle2Outline className="h-7 w-7 " />
            <div className="buttonText">It&apos;s OK</div>
          </button>

          <button
            onClick={handleClickEdit}
            className="smallButton !border-none !bg-primary !text-white"
          >
            <Edit2Outline className="h-7 w-7 " />
            <div className="buttonText">Edit</div>
          </button>
        </div>
      </div>
    );
  },
);
CompareBar.displayName = 'CompareBar';
