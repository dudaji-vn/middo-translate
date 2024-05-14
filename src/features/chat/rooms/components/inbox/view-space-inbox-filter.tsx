import { useSpaceInboxFilterStore } from '@/stores/space-inbox-filter.store';
import React from 'react';
import DisplayedSelectedFilter from '../filter/displayed-selected-filter';
import { RoomsFilterName } from '../rooms.modal-filter';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import { Globe } from 'lucide-react';

const ViewSpaceInboxFilter = (props: React.HTMLAttributes<HTMLElement>) => {
  const { selectedFilters, setSelectedFilters, filterOptions } =
    useSpaceInboxFilterStore();

  const onClearAllFilters = () => {
    setSelectedFilters({
      countries: [],
      domains: [],
      tags: [],
    });
  };
  const onRemoveFilterItem = (name: string, value: string) => {
    const selectedValues = selectedFilters[name as RoomsFilterName] || [];
    setSelectedFilters({
      ...selectedFilters,
      [name]: selectedValues.filter((val) => val !== value),
    });
  };
  const onRemoveFilterSection = (name: string) => {
    setSelectedFilters({
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
      {} as Record<string, any>,
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
      <div
        className={
          'mt-0 flex cursor-pointer flex-row items-center gap-2 [&_svg]:!size-4 '
        }
      >
        {params[value].icon}
        <span className="line-clamp-1 max-w-14 flex-1 break-words text-base font-normal max-sm:max-w-[200px] ">
          {params[value]?.label || value}
        </span>
      </div>
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
