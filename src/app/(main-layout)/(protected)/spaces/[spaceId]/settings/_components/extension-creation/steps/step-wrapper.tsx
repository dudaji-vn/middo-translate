import { Button, ButtonProps } from '@/components/actions';
import { TabsContent } from '@/components/navigation';
import { Card } from '@/components/ui/card';
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
  cardProps,
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
  cardProps?: React.ComponentPropsWithoutRef<typeof Card>;
  nextProps?: Omit<ButtonProps, 'endIcon'> & {
    endIcon?: any;
  };
  footerProps?: React.ComponentPropsWithoutRef<'div'>;
}) => {
  return (
    <TabsContent
      {...props}
      className={cn('mt-0 bg-primary-100 px-4 dark:bg-[#030303]', className)}
    >
      <Card
        {...cardProps}
        className={cn(
          'min-h-[500px] rounded-md border-none p-0 shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)] ',
          cardProps?.className,
        )}
      >
        {children}
      </Card>
      <div
        {...footerProps}
        className={cn(
          'flex h-fit w-full flex-row items-center justify-between bg-transparent py-4 dark:bg-[#030303]',
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
