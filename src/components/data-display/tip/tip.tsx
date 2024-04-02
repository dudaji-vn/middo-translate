import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { Lightbulb, XIcon } from 'lucide-react';
import React from 'react';

const Tip = ({
  hideTip,
  closeTip,
  tipContent,
  tipTitle,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  hideTip: boolean;
  tipContent: string;
  tipTitle: string;
  closeTip: () => void;
}) => {
  return (
    <div
      {...props}
      className={cn(
        hideTip
          ? 'hidden'
          : 'flex w-full items-center justify-end gap-2 bg-background py-1 font-semibold',
        props.className,
      )}
    >
      <div className="flex h-auto w-full flex-col items-center justify-between rounded-xl bg-neutral-50 p-2 text-neutral-700 ">
        <div className="flex w-full flex-row justify-between">
          <Typography className="font-open-sans flex items-center gap-1 text-left text-base font-medium leading-5 tracking-normal text-neutral-600">
            <Lightbulb />
            {tipTitle}
          </Typography>
          <Button.Icon
            onClick={closeTip}
            variant={'ghost'}
            color={'default'}
            size={'xs'}
            className="text-neutral-600"
          >
            <XIcon />
          </Button.Icon>
        </div>
        <Typography className="flex flex-row items-center gap-2 text-start text-[14px] text-sm font-light leading-[18px] text-neutral-400">
          {tipContent}
        </Typography>
      </div>
    </div>
  );
};

export default Tip;
