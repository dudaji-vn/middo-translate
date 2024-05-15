import { useSpaceInboxFilterStore } from '@/stores/space-inbox-filter.store';
import React from 'react';
import DisplayedSelectedFilter from '../filter/displayed-selected-filter';
import { RoomsFilterName } from '../rooms.modal-filter';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import { Globe } from 'lucide-react';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { RoomsFilterOption } from '../filter/filter-section';

const ViewSpaceInboxFilter = (props: React.HTMLAttributes<HTMLElement>) => {
  const { selectedFilters, setFilterApplied, filterOptions } =
    useSpaceInboxFilterStore();

  const onClearAllFilters = () => {
    setFilterApplied({
      countries: [],
      domains: [],
      tags: [],
    });
  };
  const onRemoveFilterItem = (name: string, value: string) => {
    const selectedValues = selectedFilters[name as RoomsFilterName] || [];
    setFilterApplied({
      ...selectedFilters,
      [name]: selectedValues.filter((val) => val !== value),
    });
  };
  const onRemoveFilterSection = (name: string) => {
    setFilterApplied({
      ...selectedFilters,
      [name]: [],
    });
  };
  const getParams = (key: 'countries' | 'tags' | 'domains') =>
    filterOptions?.[key]?.reduce(
      (acc, tag) => {
        acc[tag.value as string] = tag;
        return acc;
      },
      {} as Record<string, RoomsFilterOption>,
    );
  const renderValue = (section: string, value: string) => {
    const params = getParams(section as RoomsFilterName) || {};
    if (section === 'tags') {
      return (
        <Badge
          variant="default"
          className={cn(
            'line-clamp-1 max-w-[380px] cursor-pointer  capitalize max-sm:max-w-[200px]',
          )}
          {...params[value]?.props}
        >
          {params[value]?.label}
        </Badge>
      );
    }
    return (
      <Tooltip
        title={params[value]?.label || value}
        triggerItem={
          <div
            className={
              'mt-0 flex cursor-pointer flex-row items-center gap-1 [&_svg]:!size-4 '
            }
          >
            {params[value].icon}
            <span className="line-clamp-1 max-w-[100px] flex-1 break-words text-left text-base font-normal ">
              {params[value]?.label || value}
            </span>
          </div>
        }
      />
    );
  };
  return (
    <DisplayedSelectedFilter
      filterData={selectedFilters}
      onClearFilter={onClearAllFilters}
      onRemoveItem={onRemoveFilterItem}
      onRemoveSection={onRemoveFilterSection}
      {...props}
      renderValue={renderValue}
    />
  );
};

export default ViewSpaceInboxFilter;
