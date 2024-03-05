"use client"

import { Button } from '@/components/actions';
import { ROUTE_NAMES } from '@/configs/route-name';
import { cn } from '@/utils/cn';
import { HistoryIcon, SparkleIcon, SparklesIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export interface ExtensionProps {}

// TODO: Add shortcut to open history and phrases after the feature is implemented

export const Extension = (props: ExtensionProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const onClickHistory = () => {
    push(`${pathname}?tab=history`);
  }
  const onClickPhrases = () => {
    push(`${pathname}?tab=phrases`);
  }
  const isHightlighted = (tab: string) => {
    return searchParams?.get('tab') === tab ? 'bg-primary-200 text-primary-500-main' : '';
  }

  return (
    <div className="flex w-full justify-end gap-2 px-[5vw]">
      <Button
        shape="square"
        color="default"
        size="xs"
        startIcon={<HistoryIcon />}
        onClick={onClickHistory}
        className={cn('rounded-2xl', isHightlighted('history'))}
      >
        History
      </Button>
      <Button
        shape="square"
        color="default"
        size="xs"
        startIcon={<SparklesIcon />}
        onClick={onClickPhrases}
        className={cn('rounded-2xl', isHightlighted('phrases'))}
      >
        Phrases
      </Button>
    </div>
  );
};
