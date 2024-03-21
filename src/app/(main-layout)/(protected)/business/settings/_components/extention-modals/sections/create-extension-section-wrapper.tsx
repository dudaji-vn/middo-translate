
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
};
export const CreateExtensionSectionWrapper: React.FC<CreateExtensionSectionWrapperProps & AccordionItemProps> = ({
    value,
    children,
    onNextStep = () => { },
    isDone = false,
    nextStepType = 'button',
    nextStepProps,
    accordionContentProps,
    ...props
}) => (
    <AccordionItem {...props} value={value} className='py-0 my-0'>
        <AccordionTrigger className="flex h-11 w-full flex-row items-center justify-between  rounded-none !bg-neutral-50 p-2 py-1 ">
            <Typography
                variant="h4"
                className="text-base leading-[18px] text-neutral-600  capitalize"
            >
                {value}
            </Typography>
        </AccordionTrigger>
        <AccordionContent {...accordionContentProps}  className={cn("accordion-up 0.2s ease-out flex flex-col gap-0  p-4 pt-0 w-full", accordionContentProps?.className)}>
                {children}
                <Button
                    variant="default"
                    color="primary"
                    size={'xs'}
                    shape={'square'}
                    className={isDone ? "w-fit ml-auto mt-2" : 'hidden'}
                    type={nextStepType}
                    {...nextStepProps}
                    onClick={onNextStep}
                >
                    Next step
                </Button>
        </AccordionContent>
    </AccordionItem>
);