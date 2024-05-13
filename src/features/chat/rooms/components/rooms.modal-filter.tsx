import { useEffect, useMemo, useState } from 'react';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/actions';
import { ChevronDown, Globe, ListFilter } from 'lucide-react';
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
import { SUPPORTED_LANGUAGES } from '@/configs/default-language';
import { Global } from 'recharts';
import { isEmpty } from 'lodash';

export type RoomsFilterOption = {
  value: string;
  icon?: React.ReactNode;
  props?: React.ComponentPropsWithoutRef<'div'>;
  label?: string;
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
  const hasSelected = !!selectedValues.length;

  const onSelectAll = () => {
    setSelectedFilters({
      ...selectedFilters,
      [name]: options.map((option) => option.value),
    });
  };
  const onDeselectAll = () => {
    setSelectedFilters({
      ...selectedFilters,
      [name]: [],
    });
  };

  const onToggleFilter = (value: string) => {
    setSelectedFilters({
      ...selectedFilters,
      [name]: selectedValues.includes(value)
        ? selectedValues.filter((val) => val !== value)
        : [...selectedValues, value],
    });
  };

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
        <div
          className="h flex w-full cursor-pointer flex-row items-center justify-start gap-2"
          onClick={(e) => {
            e.stopPropagation();
            hasSelected ? onDeselectAll() : onSelectAll();
          }}
        >
          <Checkbox checked={hasSelected} />
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

export interface RoomsFilterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const RoomsModalFilter = (props: RoomsFilterProps) => {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const {
    filterOptions,
    setSelectedFilters,
    selectedFilters,
    setFilterApplied,
  } = useSpaceInboxFilterStore();

  const onUpdateFilterOptions = () => {
    setFilterApplied(selectedFilters);
    setOpen(false);
  };
  const onDeselectAll = () => {
    setSelectedFilters({
      countries: [],
      domains: [],
      tags: [],
    });
  };
  const onSelectAll = () => {
    setSelectedFilters({
      countries: filterOptions.countries?.map((c) => c.value) || [],
      domains: filterOptions.domains?.map((d) => d.value) || [],
      tags: filterOptions.tags?.map((t) => t.value) || [],
    });
  };
  const { isSelectAll } = useMemo(() => {
    const isSelectAllCountries =
      filterOptions.countries?.length === selectedFilters.countries?.length;
    const isSelectAllDomains =
      filterOptions.domains?.length === selectedFilters.domains?.length;
    const isSelectAllTags =
      filterOptions.tags?.length === selectedFilters.tags?.length;
    return {
      isSelectAll:
        isSelectAllCountries && isSelectAllDomains && isSelectAllTags,
    };
  }, [filterOptions, selectedFilters]);

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
        <DialogContent className="h-fit  max-w-[500px] gap-0 p-0">
          <div className="flex flex-row items-center justify-between p-3">
            <Typography className="font-semibold text-neutral-800">
              Filter by
            </Typography>
            <Button
              variant={'ghost'}
              color="primary"
              size={'xs'}
              shape={'square'}
              onClick={() => {
                isSelectAll ? onDeselectAll() : onSelectAll();
              }}
            >
              {isSelectAll
                ? t('FILTERS.BUTTONS.DESELECT_ALL')
                : t('FILTERS.BUTTONS.SELECT_ALL')}
            </Button>
          </div>
          <div className=" mb-4 h-fit max-h-[400px] max-w-[500px] space-y-3 overflow-y-scroll bg-white">
            <Accordion
              type="multiple"
              className="h-full w-full max-w-full p-0 transition-all duration-500  "
              defaultValue={['countries', 'domains', 'tags']}
            >
              <FilterSection title={t('FILTERS.COUNTRIES')} name="countries" />
              <FilterSection title={t('FILTERS.DOMAINS')} name="domains" />
              <FilterSection title={t('FILTERS.TAGS')} name="tags" />
            </Accordion>
          </div>
          <div className="w-full p-3">
            <Button
              className="w-full"
              size={'xs'}
              shape={'square'}
              onClick={onUpdateFilterOptions}
            >
              Filter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
