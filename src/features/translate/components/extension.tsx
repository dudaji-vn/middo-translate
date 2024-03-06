'use client';

import { Button } from '@/components/actions';
import { TranslationTab } from '@/types/translationstab.type';
import { cn } from '@/utils/cn';
import { HistoryIcon, SparklesIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect,  useState } from 'react';
import { useHistoryStore } from '../stores/history.store';
export interface ExtensionProps { }

// TODO: Add shortcut to open history and phrases after the feature is implemented

export const Extension = (props: ExtensionProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const { historyListItems } = useHistoryStore();
  const [showHistory, setShowHistory] = useState(false);
  const params = new URLSearchParams(searchParams as URLSearchParams);
  const tab = searchParams?.get('tab');
  const onCloseTab = useCallback(() => {
    params.delete('tab');
    replace(`${pathname}?${params.toString()}`);
  }, [params, replace, pathname]);

  const onClickHistory = () => {
    if (tab === TranslationTab.HISTORY) {
      onCloseTab();
      return;
    }
    params.set('tab', TranslationTab.HISTORY);
    replace(`${pathname}?${params.toString()}`);
  };
  const onClickPhrases = () => {
    if (tab === TranslationTab.PHRASES) {
      onCloseTab();
      return;
    }
    params.set('tab', TranslationTab.PHRASES);
    replace(`${pathname}?${params.toString()}`);
  };
  useEffect(() => {
    setShowHistory(historyListItems.length > 0);
  }, [historyListItems, tab])


  const isHightlighted = (tab: string) => {
    return searchParams?.get('tab') === tab
      ? 'bg-primary-200 text-primary-500-main'
      : '';
  };
  return (
    <div className="flex w-full justify-end gap-2 px-[5vw]">
      <Button
        shape="square"
        color="default"
        size="xs"
        startIcon={<HistoryIcon />}
        onClick={onClickHistory}
        className={cn(
          'rounded-2xl',
          isHightlighted(TranslationTab.HISTORY),
          showHistory ? 'block' : 'hidden',
        )}
      >
        History
      </Button>
      <Button
        shape="square"
        color="default"
        size="xs"
        startIcon={<SparklesIcon />}
        onClick={onClickPhrases}
        className={cn('rounded-2xl', isHightlighted(TranslationTab.PHRASES))}
      >
        Phrases
      </Button>
    </div>
  );
};
