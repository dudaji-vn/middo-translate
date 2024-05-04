import { Button } from '@/components/actions';
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
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsContent> & {
  onNextStep?: () => void;
  onPrevStep?: () => void;
  canNext?: boolean;
  canPrev?: boolean;
  onNextLabel?: string;
  onPrevLabel?: string;
  cardProps?: React.ComponentPropsWithoutRef<typeof Card>;
  nextButtonType?: 'button' | 'submit';
}) => {
  return (
    <TabsContent {...props} className={cn('bg-primary-100 px-4', className)}>
      <Card
        className="min-h-[500px] rounded-md border-none p-5 shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)] "
        {...cardProps}
      >
        {children}
      </Card>
      <div className="flex h-fit w-full flex-row items-center justify-between bg-transparent py-4">
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
          endIcon={<ArrowRight />}
          onClick={onNextStep}
          disabled={!canNext}
          className={onNextStep ? 'min-w-[240px]' : 'invisible'}
          type={props.nextButtonType}
        >
          {onNextLabel}
        </Button>
        <Button className="invisible" />
      </div>
    </TabsContent>
  );
};

export default StepWrapper;
