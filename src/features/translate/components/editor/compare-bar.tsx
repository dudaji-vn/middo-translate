'use client';

import { CheckCircle2, Edit2Icon } from 'lucide-react';
import {
  addAcceptDiffResult,
  getAcceptDiffResult,
} from '@/utils/local-storage';
import { forwardRef, useEffect, useMemo, useState } from 'react';

import { useSetParams } from '@/hooks/use-set-params';

export interface CompareBarProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  textCompare: string;
  type?: 'edit' | 'accept';
}

export const CompareBar = forwardRef<HTMLDivElement, CompareBarProps>(
  ({ text, textCompare, type = 'edit', ...props }, ref) => {
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
          {type === 'accept' ? (
            <button
              onClick={handleAccept}
              className="circleButton ml-auto !bg-success !text-white shadow-1"
            >
              <CheckCircle2 className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleClickEdit}
              className="circleButton ml-auto !bg-primary !text-white shadow-1"
            >
              <Edit2Icon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    );
  },
);
CompareBar.displayName = 'CompareBar';
