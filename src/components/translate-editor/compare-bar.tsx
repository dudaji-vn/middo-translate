'use client';

import {
  CheckmarkCircle2,
  CheckmarkCircle2Outline,
  CloseCircle,
  Edit2Outline,
} from '@easy-eva-icons/react';
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

    return (
      <div ref={ref} {...props} className="relative">
        {isMatch ? (
          <div ref={ref} {...props} className="relative">
            <div className="absolute left-1/2 top-1/2 w-fit -translate-x-1/2 -translate-y-1/2 rounded-full bg-success-2/10 p-[19px]">
              <div className="w-fit rounded-full bg-success-2/20 p-[25px]">
                <div className="w-fit rounded-full border-[3px] border-success bg-white text-success">
                  <CheckmarkCircle2 width={28} height={28} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-between">
            <button onClick={handleAccept} className="smallButton ">
              <CheckmarkCircle2Outline className="h-7 w-7 " />
              <div className="buttonText">It&apos;s OK</div>
            </button>
            <div className="bg-error-2/10 absolute left-1/2 top-1/2 w-fit -translate-x-1/2 -translate-y-1/2 rounded-full p-[19px]">
              <div className="bg-error-2/30 w-fit rounded-full p-[25px]">
                <div className="w-fit rounded-full border-[3px] border-error bg-white text-error">
                  <CloseCircle width={28} height={28} />
                </div>
              </div>
            </div>
            <button
              onClick={handleClickEdit}
              className="smallButton !border-none !bg-primary !text-white"
            >
              <Edit2Outline className="h-7 w-7 " />
              <div className="buttonText">Edit</div>
            </button>
          </div>
        )}
      </div>
    );
  },
);
CompareBar.displayName = 'CompareBar';
