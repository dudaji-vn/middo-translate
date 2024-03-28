
import { Button, ButtonProps } from '@/components/actions';
import { Typography } from '@/components/data-display';
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/data-display/accordion';
import { cn } from '@/utils/cn';
import { AccordionContentProps, AccordionItemProps } from '@radix-ui/react-accordion';

export type CreateExtensionSectionWrapperProps = {
    children: React.ReactNode;
    isDone?: boolean;
    onNextStep?: () => void;
    nextStepType?: 'submit' | 'button';
    nextStepProps?: ButtonProps;
    accordionContentProps?: AccordionContentProps;
    disabledTrigger?: boolean;
    onTriggerClick?: () => void;
    nextStepText?: string;
};
export const CreateExtensionSectionWrapper: React.FC<CreateExtensionSectionWrapperProps & AccordionItemProps> = ({
    value,
    children,
    onNextStep = () => { },
    isDone = false,
    nextStepType = 'button',
    nextStepProps,
    accordionContentProps,
    disabledTrigger = false,
    onTriggerClick,
    nextStepText = 'Next step',
    ...props
}) => (
    <AccordionItem {...props} value={value} className='py-0 my-0'>
        <AccordionTrigger className="flex h-11 w-full flex-row items-center justify-between  rounded-none !bg-neutral-50 p-2 py-1 " disabled={disabledTrigger} onClick={onTriggerClick}>
            <Typography
                variant="h4"
                className="text-base leading-[18px] text-neutral-600  capitalize"
            >
                {value}
            </Typography>
        </AccordionTrigger>
        <AccordionContent {...accordionContentProps} className={cn("accordion-up 0.2s ease-out flex flex-col gap-0  p-4 pt-0 w-full", accordionContentProps?.className)}>
            {children}
            <Button
                variant="default"
                color="primary"
                size={'lg'}
                shape={'square'}
                className={isDone ?  "ml-auto mt-4" : 'hidden'}
                type={nextStepType}
                {...nextStepProps}
                onClick={onNextStep}
            >
                {nextStepText}
            </Button>
        </AccordionContent>
    </AccordionItem>
);