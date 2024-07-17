import { Button, ButtonProps } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { TabsContent } from '@/components/navigation';
import { cn } from '@/utils/cn';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React from 'react';

const StepWrapper = ({
  className,
  children,
  onNextStep,
  onPrevStep,
  canNext = false,
  canPrev = false,
  onNextLabel = 'Next',
  onPrevLabel = 'Previous',
  footerProps,
  isLoading,
  nextProps = {
    endIcon: <ArrowRight />,
  },
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsContent> & {
  onNextStep?: () => void;
  onPrevStep?: () => void;
  canNext?: boolean;
  canPrev?: boolean;
  onNextLabel?: string;
  onPrevLabel?: string;
  isLoading?: boolean;
  nextProps?: Omit<ButtonProps, 'endIcon'> & {
    endIcon?: any;
  };
  footerProps?: React.ComponentPropsWithoutRef<'div'>;
}) => {
  return (
    <TabsContent {...props} className={cn('mt-0', className)}>
      <div className="flex size-full min-h-[calc(100vh-200px)] flex-col gap-8 ">
        {children}
      </div>
      <div
        {...footerProps}
        className={cn(
          'flex h-fit w-full flex-row items-center justify-between bg-transparent p-4 py-4 dark:bg-[#030303]',
          footerProps?.className,
        )}
      >
        <Button
          variant={'ghost'}
          color={'default'}
          shape={'square'}
          disabled={!canPrev}
          size={'sm'}
          startIcon={<ArrowLeft />}
          className={onPrevStep ? '' : 'invisible'}
          onClick={onPrevStep}
        >
          {onPrevLabel}
        </Button>
        <Button
          color={'primary'}
          shape={'square'}
          size={'sm'}
          loading={isLoading}
          disabled={!canNext}
          onClick={onNextStep}
          className={onNextStep ? 'min-w-[240px]' : 'invisible'}
          {...nextProps}
        >
          {onNextLabel}
        </Button>
        <Button className="invisible" />
      </div>
    </TabsContent>
  );
};

export default StepWrapper;
