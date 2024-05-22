import { TimePickerType } from './report-picker-time';

export const generateHref = (
  type: TimePickerType,
  custom: { fromDate: string; toDate: string },
  filterOptions: Record<TimePickerType, string>,
  defaultOption: string,
  current: URLSearchParams,
) => {
  if (!filterOptions[type]) {
    return null;
  }
  if (type === 'custom' && custom.fromDate && !custom.toDate) {
    current.set('fromDate', custom.fromDate);
    current.set('toDate', custom.toDate);
    current.set('type', type || defaultOption);
    return `/statistics?${current.toString()}`;
  } else if (type !== 'custom') {
    current.set('type', type);
    return `/statistics?${current.toString()}`;
  }
  return null;
};
