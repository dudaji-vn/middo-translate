import { useSpaceInboxFilterStore } from '@/stores/space-inbox-filter.store';
import React from 'react';
import DisplayedSelectedFilter from '../filter/displayed-selected-filter';
import { RoomsFilterName } from '../rooms.modal-filter';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { RoomsFilterOption } from '../filter/filter-section';
import { SUPPORTED_LANGUAGES } from '@/configs/default-language';

const ViewSpaceInboxFilter = (props: React.HTMLAttributes<HTMLElement>) => {
  const { appliedFilters, setFilterApplied, filterOptions } =
    useSpaceInboxFilterStore();

  const onClearAllFilters = () => {
    setFilterApplied({
      countries: [],
      domains: [],
      tags: [],
    });
  };
  const onRemoveFilterItem = (name: string, value: string) => {
    const applied = appliedFilters?.[name as RoomsFilterName] || [];
    setFilterApplied({
      ...appliedFilters,
      [name]: applied.filter((item) => item !== value),
    } as Record<RoomsFilterName, string[]>);
  };
  const onRemoveFilterSection = (name: string) => {
    setFilterApplied({
      ...appliedFilters,
      [name]: [],
    } as Record<RoomsFilterName, string[]>);
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
    const displayText = String(
      section === 'countries'
        ? SUPPORTED_LANGUAGES.find((l) => l.code === value)?.name
        : params[value]?.label || value,
    );

    if (section === 'tags') {
      return (
        <Badge
          variant="default"
          className={cn(
            'line-clamp-1 max-w-[380px] cursor-pointer  capitalize max-sm:max-w-[200px]',
          )}
          {...params[value]?.props}
        >
          {displayText}
        </Badge>
      );
    }
    return (
      <Tooltip
        title={displayText}
        triggerItem={
          <div
            className={
              'mt-0 flex cursor-pointer flex-row items-center gap-1 [&_svg]:!size-4 '
            }
          >
            {params[value].icon}
            <span className="line-clamp-1 max-w-[100px] flex-1 break-words text-left text-base font-normal ">
              {displayText}
            </span>
          </div>
        }
      />
    );
  };
  return (
    <>
      <DisplayedSelectedFilter
        filterData={appliedFilters}
        onClearFilter={onClearAllFilters}
        onRemoveItem={onRemoveFilterItem}
        onRemoveSection={onRemoveFilterSection}
        {...props}
        renderValue={renderValue}
      />
    </>
  );
};

export default ViewSpaceInboxFilter;
