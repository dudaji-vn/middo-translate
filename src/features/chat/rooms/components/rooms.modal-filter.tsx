import { useMemo, useState } from 'react';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/actions';
import { ChevronDown, ListFilter } from 'lucide-react';
import { Typography, TypographyProps } from '@/components/data-display';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/data-display/accordion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useSpaceInboxFilterStore } from '@/stores/space-inbox-filter.store';
import { Checkbox } from '@/components/form/checkbox';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/badge';

export type RoomsFilterOption = {
  value: string;
  icon?: React.ReactNode;
  props?: React.ComponentPropsWithoutRef<'div'>;
};
type FilterSectionProps = {
  title: string;
  name: 'countries' | 'domains' | 'tags';
};

const FilterSection: React.FC<FilterSectionProps> = ({ title, name }) => {
  const { filterOptions, selectedFilters, setSelectedFilters } =
    useSpaceInboxFilterStore();
  const options = filterOptions[name] || [];
  const selectedValues = selectedFilters[name] || [];

  const onToggleFilter = (value: string) => {
    setSelectedFilters({
      ...selectedFilters,
      [name]: selectedValues.includes(value)
        ? selectedValues.filter((val) => val !== value)
        : [...selectedValues, value],
    });
  };

  return (
    <AccordionItem value={title} className="p-0">
      <AccordionTrigger
        icon={
          <ChevronDown
            size={16}
            className="transition-transform duration-300 group-data-[state=open]:rotate-180"
          />
        }
        className="flex h-fit w-full flex-row items-center justify-between  rounded-none !bg-primary-100 px-3 py-4"
      >
        <Typography
          variant="h4"
          className="text-base font-normal leading-[18px] text-neutral-800"
        >
          {title}
        </Typography>
      </AccordionTrigger>
      <AccordionContent className="accordion-up 0.2s p-0 ease-out">
        <div className="flex flex-col gap-0 divide-y divide-neutral-50">
          {options.map((item, index) => {
            return (
              <div
                key={index}
                className="my-0 flex h-[50px] w-full cursor-pointer flex-row items-center justify-between p-3"
                onClick={() => onToggleFilter(item.value)}
              >
                <Checkbox
                  checked={selectedValues.includes(item.value)}
                  // onCheckedChange={() => onToggleFilter(item.value)}
                  label={
                    name === 'tags' ? (
                      <Badge
                        variant="default"
                        className={cn(
                          'line-clamp-1 cursor-pointer capitalize',
                          {
                            hidden: !item.value,
                          },
                        )}
                        {...item.props}
                      >
                        {item.value}
                      </Badge>
                    ) : (
                      <div
                        className={
                          'mt-0  flex cursor-pointer flex-row items-center gap-2 text-base font-normal'
                        }
                        {...item.props}
                      >
                        {item.icon && item.icon}
                        {item.value}
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

export interface RoomsFilterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const RoomsModalFilter = (props: RoomsFilterProps) => {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const { filterOptions, setSelectedFilters } = useSpaceInboxFilterStore();

  const onUpdateFilterOptions = () => {
    console.log('Update filter options: ', filterOptions);
    // TODO: refetch inbox list with new filter options
    setOpen(false);
  };
  const onDeselectAll = () => {
    setSelectedFilters({
      countries: [],
      domains: [],
      tags: [],
    });
  };

  return (
    <>
      <Tooltip
        title={t('TOOL_TIP.FILTER')}
        triggerItem={
          <Button.Icon color="default" size="xs" onClick={() => setOpen(true)}>
            <ListFilter />
          </Button.Icon>
        }
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-fit  max-w-[400px] gap-0 p-0">
          <div className="flex flex-row items-center justify-between p-3">
            <Typography className="font-semibold text-neutral-800">
              Filter by
            </Typography>
            <Button
              variant={'ghost'}
              color="primary"
              size={'xs'}
              shape={'square'}
              onClick={onDeselectAll}
            >
              Deselect All
            </Button>
          </div>
          <div className=" mb-4 h-fit max-h-[400px] space-y-3 overflow-y-scroll bg-white">
            <Accordion
              type="multiple"
              className="h-full w-full p-0 transition-all duration-500  "
              //   defaultValue={defaultValue}
            >
              <FilterSection title={t('FILTERS.COUNTRIES')} name="countries" />
              <FilterSection title={t('FILTERS.DOMAINS')} name="domains" />
              <FilterSection title={t('FILTERS.TAGS')} name="tags" />
            </Accordion>
          </div>
          <div className="w-full p-3">
            <Button className="w-full" size={'xs'} shape={'square'}>
              Filter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
