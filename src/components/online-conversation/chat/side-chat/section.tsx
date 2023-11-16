import { cn } from '@/utils/cn';

export interface SectionProps {
  title?: string;
  children?: React.ReactNode;
  titleClassName?: string;
  rightTitle?: React.ReactNode;
}

export const Section = (props: SectionProps) => {
  return (
    <div className="px-5">
      <div className={cn('flex border-b py-3', props.titleClassName)}>
        <span>{props.title}</span>
        <span className="ml-auto">{props.rightTitle}</span>
      </div>
      <div>{props.children}</div>
    </div>
  );
};
