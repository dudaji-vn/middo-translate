import { useMemo, useState } from 'react';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/actions';
import { ListFilter } from 'lucide-react';
import { Typography } from '@/components/data-display';
import { Accordion } from '@/components/data-display/accordion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useSpaceInboxFilterStore } from '@/stores/space-inbox-filter.store';
import { FilterSection, RoomsFilterOption } from './filter/filter-section';

type RoomsFilterName = 'countries' | 'domains' | 'tags';

type TFilterSection = {
  name: RoomsFilterName;
  label: string;
};
const FILTER_SECTIONS: TFilterSection[] = [
  {
    name: 'countries',
    label: 'FILTERS.COUNTRIES',
  },
  {
    name: 'domains',
    label: 'FILTERS.DOMAINS',
  },
  {
    name: 'tags',
    label: 'FILTERS.TAGS',
  },
];
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
    appliedFilters,
  } = useSpaceInboxFilterStore();

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

  const onUpdateFilterOptions = () => {
    setFilterApplied(isSelectAll ? undefined : selectedFilters);
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

  const disabledFilter =
    selectedFilters.countries.length === 0 &&
    selectedFilters.domains.length === 0 &&
    selectedFilters.tags.length === 0;

  const onCancel = () => {
    if (appliedFilters) {
      setSelectedFilters(appliedFilters);
    } else {
      onSelectAll();
    }
    setOpen(false);
  };
  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onCancel();
      return;
    }
    setOpen(isOpen);
  };

  const onSelectSection = (sectionName: TFilterSection['name']) => {
    const options: RoomsFilterOption[] = filterOptions[sectionName] || [];
    setSelectedFilters({
      ...selectedFilters,
      [sectionName]: options.map((option) => option.value),
    });
  };
  const onDeselectSection = (sectionName: TFilterSection['name']) => {
    setSelectedFilters({
      ...selectedFilters,
      [sectionName]: [],
    });
  };

  const onToggleFilterItem = (value: string, name: string) => {
    const selectedValues = selectedFilters[name as RoomsFilterName] || [];
    setSelectedFilters({
      ...selectedFilters,
      [name]: selectedValues.includes(value)
        ? selectedValues.filter((val) => val !== value)
        : [...selectedValues, value],
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
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!max-h-[80vh] min-h-fit max-w-[calc(100vw-32px)] flex-row gap-0 rounded-[12px] p-0 md:max-w-[500px] ">
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
          <div className="h-fit max-h-[400px] max-w-[500px] space-y-3 overflow-y-scroll bg-white">
            <Accordion
              type="multiple"
              className="h-full w-full max-w-full p-0 transition-all duration-500  "
              defaultValue={['countries', 'domains', 'tags']}
            >
              {FILTER_SECTIONS.map(({ label, name }) => {
                const nameFilter = name as RoomsFilterName;
                return (
                  <FilterSection
                    key={name}
                    title={t(label)}
                    name={name}
                    options={filterOptions[name] || []}
                    selectedValues={selectedFilters[nameFilter] || []}
                    onSelectAll={() => onSelectSection(nameFilter)}
                    onDeselectAll={() => onDeselectSection(nameFilter)}
                    onToggleFilter={(value) =>
                      onToggleFilterItem(value, nameFilter)
                    }
                  />
                );
              })}
            </Accordion>
          </div>
          <div className="w-full rounded-b-[12px] p-3  ">
            <Button
              className="w-full"
              size={'xs'}
              shape={'square'}
              onClick={onUpdateFilterOptions}
              disabled={disabledFilter}
            >
              Filter
            </Button>
            <Button
              className="mt-3 w-full"
              size={'xs'}
              shape={'square'}
              color={'default'}
              variant={'ghost'}
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
