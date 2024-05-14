import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import { ChevronDown, XIcon } from 'lucide-react';
import React from 'react';

const DisplayedSelectedFilter = ({
  filterData,
  onClearFilter,
  onRemoveItem,
  onRemoveSection,
  hidden = false,
  renderValue,
  ...props
}: {
  filterData: Record<string, string[]>;
  onClearFilter: () => void;
  onRemoveItem: (filterField: string, value: string) => void;
  onRemoveSection: (filterField: string) => void;
  hidden?: boolean;
  renderValue?: (section: string, value: string) => React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) => {
  const [expanded, setExpanded] = React.useState(false);
  const sections = Object.keys(filterData);

  return (
    <>
      <section
        {...props}
        className={cn(
          'flex w-full scale-y-100 flex-row items-center px-3 py-2 transition-all duration-300',
          hidden && 'hidden scale-y-0',
          props.className,
        )}
      >
        <div
          className={cn('flex w-full flex-row items-center justify-between')}
        >
          <Typography className="text-sm text-neutral-300">
            Filter by
          </Typography>
          <Button variant="ghost" shape={'square'} size={'xs'}>
            Clear filter
          </Button>
        </div>
        <Button.Icon
          onClick={() => setExpanded(!expanded)}
          variant="ghost"
          shape={'square'}
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
      </section>
      {expanded && (
        <div className="flex h-fit max-h-[400px] w-full flex-col gap-3 pb-2">
          {sections.map((section) => {
            const values = filterData[section];
            return (
              <div
                key={section}
                className={cn('flex flex-row justify-between gap-2', {
                  hidden: values.length === 0,
                })}
              >
                <div className="row-span-1 grid  w-[90%] grid-cols-3 gap-1">
                  {values.map((value) => {
                    return (
                      <Button
                        size={'xs'}
                        key={value}
                        color={'default'}
                        shape={'square'}
                        onClick={() => onRemoveItem(section, value)}
                        className="relative flex w-full flex-row justify-between gap-2 "
                      >
                        {renderValue?.(section, value) || (
                          <span className=" max-w-full flex-1  !truncate text-ellipsis text-sm font-semibold ">
                            {value}
                          </span>
                        )}
                        <em />
                        <XIcon className="absolute right-2 top-3 !size-4" />
                      </Button>
                    );
                  })}
                </div>
                <Button.Icon
                  onClick={() => onRemoveSection(section)}
                  variant="ghost"
                  shape={'square'}
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
    </>
  );
};

export default DisplayedSelectedFilter;
