import { ChevronDown } from 'lucide-react';
import { Typography } from '@/components/data-display';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/data-display/accordion';
import { useSpaceInboxFilterStore } from '@/stores/space-inbox-filter.store';
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
  onToggleFilter: (value: string) => void;
};

export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  name,
  options,
  selectedValues,
  onSelectAll,
  onDeselectAll,
  onToggleFilter,
}) => {
//   const { filterOptions, selectedFilters, setSelectedFilters } =
//     useSpaceInboxFilterStore();
  //   const options = filterOptions[name] || [];
  //   const selectedValues = selectedFilters[name] || [];
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
        className="flex h-fit w-full flex-row items-center justify-between  rounded-none !bg-primary-100 px-3 py-4"
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
            className="text-base font-normal leading-[18px] text-neutral-800"
          >
            {title}
          </Typography>
        </div>
      </AccordionTrigger>
      <AccordionContent className="accordion-up 0.2s w-full p-0  ease-out">
        <div className="flex flex-col gap-0 px-6">
          {options.map((item, index) => {
            const displayText =
              name === 'countries'
                ? SUPPORTED_LANGUAGES.find((l) => l.code === item.value)?.name
                : item.value;
            return (
              <div
                key={index}
                className="my-0 flex h-fit !w-full cursor-pointer flex-row items-center justify-between p-3"
                onClick={() => onToggleFilter(item.value)}
              >
                <Checkbox
                  checked={selectedValues.includes(item.value)}
                  label={
                    name === 'tags' ? (
                      <Badge
                        variant="default"
                        className={cn(
                          'line-clamp-1 max-w-[380px] cursor-pointer  capitalize max-sm:max-w-[200px]',
                          {
                            hidden: !item.value,
                          },
                        )}
                        {...item.props}
                      >
                        {item.label || item.value}
                      </Badge>
                    ) : (
                      <div
                        className={
                          'mt-0 flex cursor-pointer flex-row items-center gap-2 [&_svg]:!size-4 '
                        }
                      >
                        {item.icon}
                        <span className="line-clamp-1  max-w-[380px] flex-1 break-words text-base font-normal max-sm:max-w-[200px] ">
                          {displayText}
                        </span>
                      </div>
                    )
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
