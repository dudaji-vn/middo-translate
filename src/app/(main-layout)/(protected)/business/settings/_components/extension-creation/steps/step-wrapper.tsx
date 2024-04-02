import { TabsContent } from '@/components/navigation'
import { Card } from '@/components/ui/card'
import { cn } from '@/utils/cn'
import React from 'react'

const StepWrapper = ({ className, children,
  onNexStep = () => {},
  onPrevStep = () => {},
  onNextLabel = 'Next',
  onPrevLabel = 'Back',
  ...props }: React.ComponentPropsWithoutRef<typeof TabsContent> & {
  onNexStep ?: () => void
  onPrevStep ?: () => void
  onNextLabel ?: string
  onPrevLabel ?: string
}
  
  ) => {
  return (
    <TabsContent {...props}  className={cn('bg-primary-100 px-4', className,)}  >
        <Card className="p-5 rounded-md border-none shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)] d">
          {children}
        </Card>
    </TabsContent>
  )
}

export default StepWrapper