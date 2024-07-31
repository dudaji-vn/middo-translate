import { Button, ButtonProps } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { TabsContent } from '@/components/navigation';
import { cn } from '@/utils/cn';
import { ArrowLeft, ArrowRight, Rows } from 'lucide-react';
import React from 'react';
import RowsSkeletons from '../skeleton/rows-skeletons';

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
  if (isLoading) {
    return <RowsSkeletons rows={10} />;
  }
  return (
    <TabsContent {...props} className={cn('mt-0 grow', className)}>
      <div className="flex size-full h-full flex-col">{children}</div>
    </TabsContent>
  );
};

export default StepWrapper;
