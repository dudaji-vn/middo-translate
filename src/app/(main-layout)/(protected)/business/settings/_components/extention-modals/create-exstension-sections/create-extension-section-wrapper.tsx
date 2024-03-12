
import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/data-display/accordion';

export type CreateExtensionSectionWrapperProps = {
    title: string;
    children: React.ReactNode;
    isDone?: boolean;
    onNextStep?: () => void;
};
export const CreateExtensionSectionWrapper: React.FC<CreateExtensionSectionWrapperProps> = ({
    title,
    children,
    onNextStep,
    isDone = false,
}) => (
    <AccordionItem value={title}>
        <AccordionTrigger className="flex h-11 w-full flex-row items-center justify-between  rounded-none !bg-neutral-50 p-2 py-1 ">
            <Typography
                variant="h4"
                className="text-base leading-[18px] text-neutral-600  capitalize"
            >
                {title}
            </Typography>
        </AccordionTrigger>
        <AccordionContent className="accordion-up 0.2s py-0 ease-out">
            <div className="flex flex-col gap-0  p-2 w-full">
                {children}
                <Button
                    variant="default"
                    color="primary"
                    size={'xs'}
                    shape={'square'}
                    className={onNextStep && isDone ? "w-fit mx-auto" : 'hidden'}
                    onClick={() => { onNextStep && onNextStep(); }}
                >
                    Next step
                </Button>
            </div>
        </AccordionContent>
    </AccordionItem>
);