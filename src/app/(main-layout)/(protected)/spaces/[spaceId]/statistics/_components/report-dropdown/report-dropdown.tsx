import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import React, { ReactElement, cloneElement } from 'react';
import { ChevronDown, Grid2X2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { DropdownMenuItemProps } from '@radix-ui/react-dropdown-menu';

export type DropdownOption = {
  name: string;
  value: string | null;
  href?: string;
  renderOption?: (
    option: Omit<DropdownOption, 'renderOption'>,
  ) => React.ReactNode;
} & DropdownMenuItemProps;

const ReportDropdown = ({
  options = [],
  selectedOption,
  onSelectChange,
  open,
  onOpenChange = () => {},
  startIcon = <Grid2X2 />,
  endIcon = <ChevronDown />,
  triggerLabel,
  displayCurrentValue,
}: {
  open: boolean;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onOpenChange: (open: boolean) => void;
  selectedOption: DropdownOption;
  onSelectChange: (option: DropdownOption) => void;
  options: DropdownOption[];
  triggerLabel?: string | React.ReactNode;
  displayCurrentValue?: string;
}) => {
  return (
    <DropdownMenu onOpenChange={onOpenChange} open={open}>
      <DropdownMenuTrigger
        asChild
        onClick={() => {
          onOpenChange(!open);
        }}
      >
        <div className="relative flex h-12 flex-1 flex-row items-center justify-between gap-2 rounded-[12px] border border-neutral-50 p-0 text-neutral-800 active:!bg-neutral-200 active:!text-shading dark:border-neutral-800 dark:text-neutral-50 dark:active:!bg-neutral-900 md:hover:bg-neutral-100 dark:md:hover:bg-neutral-800 [&_div]:px-3 [&_div]:py-2">
          <div className="flex h-full items-center rounded-l-[12px] bg-primary-100 dark:bg-neutral-900 dark:text-primary">
            {cloneElement(startIcon, {
              size: 20,
              ...startIcon.props,
            })}
          </div>
          <div className="line-clamp-1 flex w-full  min-w-40 flex-row items-center justify-between xl:min-w-80">
            <span className="text-neutral-800 dark:text-neutral-50">
              {displayCurrentValue || selectedOption?.name || triggerLabel}
            </span>
            {cloneElement(endIcon, {
              size: 20,
              ...endIcon.props,
            })}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className=" min-w-48 max-w-full overflow-hidden rounded-2xl  border bg-background p-0 shadow-3 xl:min-w-80"
        onClick={() => onOpenChange(false)}
      >
        {options.map((option) => {
          const { name, value, href, renderOption, ...props } = option;
          if (renderOption) {
            return renderOption(option);
          }
          if (href) {
            return (
              <Link
                key={name}
                href={href}
                className={cn(' w-full text-neutral-700 dark:text-neutral-50', {
                  'bg-neutral-100': selectedOption?.value === value,
                })}
              >
                <DropdownMenuItem className="text-md flex items-center rounded-none px-4 py-3 outline-none dark:hover:bg-neutral-800">
                  {name}
                </DropdownMenuItem>
              </Link>
            );
          }
          return (
            <DropdownMenuItem
              key={name}
              className=" text-md  rounded-none px-4 py-3 text-neutral-700 outline-none hover:bg-neutral-100 hover:text-neutral-500  dark:text-neutral-50 dark:hover:bg-neutral-800"
              onClick={() => onSelectChange(option)}
              {...props}
            >
              {name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReportDropdown;
