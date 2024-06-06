'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import { ChevronDown, XIcon } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const DisplayedSelectedFilter = ({
  filterData = {},
  onClearFilter,
  onRemoveItem,
  onRemoveSection,
  hidden = false,
  renderValue,
  ...props
}: {
  filterData?: Record<string, string[]>;
  onClearFilter: () => void;
  onRemoveItem: (filterField: string, value: string) => void;
  onRemoveSection: (filterField: string) => void;
  hidden?: boolean;
  renderValue?: (div: string, value: string) => React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) => {
  const { t } = useTranslation('common');
  const [expanded, setExpanded] = React.useState(false);
  const sections = Object.keys(filterData);

  if (Object.values(filterData).flat().length === 0) {
    return null;
  }

  return (
    <section className="relative space-y-3 bg-[#FCFCFC] p-3 w-full">
      <div
        {...props}
        className={cn(
          'flex w-full scale-y-100 flex-row items-center transition-all duration-300',
          hidden && 'hidden scale-y-0',
          props.className,
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
            onClick={onClearFilter}
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
            'flex h-fit  w-full flex-col gap-3 overflow-hidden transition-all duration-300',
            hidden && 'hidden',
          )}
        >
          {sections.map((section) => {
            const values = filterData[section];
            return (
              <div
                key={section}
                className={cn(
                  'flex flex-row justify-between gap-2 rounded-[16px] bg-[#FAFAFA] p-1',
                  {
                    hidden: values.length === 0,
                  },
                )}
              >
                <div className="flex flex-1 flex-row flex-wrap gap-2 ">
                  {values.map((value) => {
                    return (
                      <Button
                        size={'xs'}
                        key={value}
                        color={'default'}
                        shape={'square'}
                        onClick={() => onRemoveItem(section, value)}
                        className="relative flex w-fit flex-row justify-between gap-2  pr-6"
                      >
                        {renderValue?.(section, value) || (
                          <span className=" max-w-full flex-1  !truncate text-ellipsis text-sm font-semibold ">
                            {value}
                          </span>
                        )}
                        <XIcon className="inset-y absolute right-2 !size-4" />
                      </Button>
                    );
                  })}
                </div>
                <Button.Icon
                  onClick={() => onRemoveSection(section)}
                  variant="ghost"
                  color="default"
                  size={'xs'}
                >
                  <XIcon />
                </Button.Icon>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default DisplayedSelectedFilter;
