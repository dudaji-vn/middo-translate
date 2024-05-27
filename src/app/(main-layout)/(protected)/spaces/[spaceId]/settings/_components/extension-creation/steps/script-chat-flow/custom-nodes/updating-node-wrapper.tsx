import { Triangle } from '@/components/icons';
import { cn } from '@/utils/cn';
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/data-display/popover';
import { PopoverContentProps, PopoverProps } from '@radix-ui/react-popover';
import { Button } from '@/components/actions';
import { Pen } from 'lucide-react';
import { FlowNode } from '../design-script-chat-flow';

const UpdatingNodeWrapper = ({
  children,
  open,
  onOpenChange,
  popoverContentProps = {},
  data,
}: {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: PopoverProps['onOpenChange'];
  popoverContentProps?: PopoverContentProps;
  data?: FlowNode['data'];
}) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button.Icon color={'default'} size={'xs'} disabled={data?.readonly}>
          <Pen size={18} />
        </Button.Icon>
      </PopoverTrigger>
      <PopoverContent
        {...popoverContentProps}
        className={cn(
          'relative z-[101] w-[420px] bg-white shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)]',
          popoverContentProps?.className,
        )}
      >
        <Triangle
          fill="#ffffff"
          position="top"
          className={'absolute left-4 top-0 -translate-y-full rotate-0'}
        />
        <div className={cn('flex h-full w-full flex-col')}>{children}</div>
      </PopoverContent>
    </Popover>
  );
};

export default UpdatingNodeWrapper;
