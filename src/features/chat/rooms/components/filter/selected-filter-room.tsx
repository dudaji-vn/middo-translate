'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { useSideChatStore } from '@/features/chat/stores/side-chat.store';
import { cn } from '@/utils/cn';
import { ChevronDown, XIcon } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const SelectedFilterRoom = () => {
  const { filters, removeFilter, removeFilters } = useSideChatStore();

  const { t } = useTranslation('common');
  const [expanded, setExpanded] = React.useState(false);

  return (
    <section
      className={cn(
        'relative w-full space-y-3 bg-[#FCFCFC] p-3 dark:bg-[#030303]',
        {
          hidden: filters.length === 0,
        },
      )}
    >
      <div
        className={cn(
          'flex w-full scale-y-100 flex-row items-center transition-all duration-300',
        )}
      >
        <div
          className={cn('flex w-full flex-row items-center justify-between')}
        >
          <Typography className="text-sm text-neutral-300">
            {t('FILTERS.FILTER_BY')}
          </Typography>
          <Button
            variant="ghost"
            shape={'square'}
            size={'xs'}
            onClick={() => removeFilters(filters)}
          >
            Clear filter
          </Button>
        </div>
        <Button.Icon
          onClick={() => setExpanded(!expanded)}
          variant="ghost"
          color="default"
          size={'xs'}
        >
          <ChevronDown
            className={cn(
              'transition-all duration-300',
              expanded && 'rotate-180',
            )}
          />
        </Button.Icon>
      </div>
      {expanded && (
        <div
          className={cn(
            'flex h-fit  w-full gap-2 overflow-hidden transition-all duration-300',
          )}
        >
          {filters.map((filter) => {
            return (
              <Button
                key={filter}
                size={'xs'}
                color={'default'}
                shape={'square'}
                onClick={() => {
                  removeFilter(filter);
                }}
                className="relative flex w-fit flex-row justify-between gap-4"
              >
                <span className="max-w-full flex-1 !truncate text-ellipsis text-sm font-semibold capitalize ">
                  {filter}
                </span>
                <XIcon className="!size-4" />
              </Button>
            );
          })}
        </div>
      )}
    </section>
  );
};
