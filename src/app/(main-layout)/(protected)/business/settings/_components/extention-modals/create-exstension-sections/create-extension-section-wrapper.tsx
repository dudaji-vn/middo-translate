
import { Typography } from '@/components/data-display';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/data-display/accordion';

export type CreateExtensionSectionWrapperProps = {
    title: string;
    children: React.ReactNode;
};
export const CreateExtensionSectionWrapper: React.FC<CreateExtensionSectionWrapperProps> = ({
    title,
    children,
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
            </div>
        </AccordionContent>
    </AccordionItem>
);