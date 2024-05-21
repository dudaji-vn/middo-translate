import { TimePickerType } from './report-picker-time';

export const generateHref = (
  type: TimePickerType,
  custom: { fromDate: string; toDate: string },
  search: string,
  filterOptions: Record<TimePickerType, string>,
  defaultOption: string,
) => {
  if (!filterOptions[type]) {
    return null;
  }
  if (type === 'custom' && custom.fromDate && !custom.toDate) {
    return `/statistics?${new URLSearchParams({
      type: type || defaultOption,
      fromDate: custom.fromDate,
      toDate: custom.toDate,
      search: search || '',
    }).toString()}`;
  } else if (type !== 'custom') {
    return `/statistics?${new URLSearchParams({
      type,
      search: search || '',
    }).toString()}`;
  }
  return null;
};
