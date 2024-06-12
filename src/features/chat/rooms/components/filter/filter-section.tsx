import { ChevronDown } from 'lucide-react';
import { Typography } from '@/components/data-display';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/data-display/accordion';
import { Checkbox } from '@/components/form/checkbox';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/badge';
import { SUPPORTED_LANGUAGES } from '@/configs/default-language';

export type RoomsFilterOption = {
  value: string;
  icon?: React.ReactNode;
  props?: React.ComponentPropsWithoutRef<'div'>;
  label?: string;
};
type FilterSectionProps = {
  title: string;
  name: 'countries' | 'domains' | 'tags';
  options: RoomsFilterOption[];
  selectedValues: string[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onToggleOption: (value: string) => void;
};

const OptionLabel = ({
  icon,
  type = 'default',
  label,
  value,
  ...props
}: RoomsFilterOption & {
  type: 'badge' | 'default';
}) => {
  if (type === 'badge') {
    return (
      <Badge
        variant="default"
        className={cn(
          'line-clamp-1 max-w-[380px] cursor-pointer  capitalize max-sm:max-w-[200px]',
          {
            hidden: !value,
          },
        )}
        {...props}
      >
        {label || value}
      </Badge>
    );
  }
  return (
    <div
      className={
        'mt-0 flex cursor-pointer flex-row items-center gap-2 [&_svg]:!size-4 '
      }
      {...props}
    >
      {icon}
      <span className="line-clamp-1  max-w-[380px] flex-1 break-words text-base font-normal max-sm:max-w-[200px] ">
        {label || value}
      </span>
    </div>
  );
};
export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  name,
  options,
  selectedValues,
  onSelectAll,
  onDeselectAll,
  onToggleOption,
}) => {
  const hasSelected = !!selectedValues.length;

  return (
    <AccordionItem value={name} className="w-full p-0">
      <AccordionTrigger
        icon={
          <ChevronDown
            size={16}
            className="transition-transform duration-300 group-data-[state=open]:rotate-180"
          />
        }
        className="flex h-fit w-full flex-row items-center justify-between  rounded-none !bg-primary-100 dark:!bg-neutral-900 px-3 py-4"
      >
        <div className="h flex w-full cursor-pointer flex-row items-center justify-start gap-2">
          <Checkbox
            checked={hasSelected}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onCheckedChange={(checked) => {
              checked ? onSelectAll() : onDeselectAll();
            }}
          />
          <Typography
            variant="h4"
            className="text-base font-normal leading-[18px] text-neutral-800 dark:text-neutral-50"
          >
            {title}
          </Typography>
        </div>
      </AccordionTrigger>
      <AccordionContent className="accordion-up 0.2s w-full p-0  ease-out dark:bg-background">
        <div className="flex flex-col gap-0 px-6">
          {options.map(({ value, label, icon, props }, index) => {
            const displayText =
              name === 'countries'
                ? SUPPORTED_LANGUAGES.find((l) => l.code === value)?.name
                : label || value;
            return (
              <div
                key={index}
                className="my-0 flex h-fit !w-full cursor-pointer flex-row items-center justify-between p-3"
                onClick={() => onToggleOption(value)}
              >
                <Checkbox
                  checked={selectedValues.includes(value)}
                  label={
                    <OptionLabel
                      type={name === 'tags' ? 'badge' : 'default'}
                      value={value}
                      label={displayText}
                      icon={icon}
                      {...props}
                    />
                  }
                />
              </div>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
