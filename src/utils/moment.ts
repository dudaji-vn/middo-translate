'use client';

import moment from 'moment';

const units: Array<{
  unit: moment.unitOfTime.Base;
  key: moment.RelativeTimeKey;
}> = [
  { unit: 'y', key: 'yy' },
  { unit: 'M', key: 'MM' },
  { unit: 'd', key: 'dd' },
  { unit: 'h', key: 'hh' },
  { unit: 'm', key: 'mm' },
  { unit: 's', key: 'ss' },
];

export function accurateHumanize(
  duration: moment.Duration,
  accuracy: number = 2,
): {
  maxUnit: moment.unitOfTime.Base;
  accuratedTime: string;
  times: string[];
} {
  let beginFilter = false;
  let componentCount = 0;
  const times = units
    .map(({ unit, key }) => ({ value: duration.get(unit), key }))
    .filter(({ value, key }) => {
      if (beginFilter === false) {
        if (value === 0) {
          return false;
        }
        beginFilter = true;
      }
      componentCount++;
      return value !== 0 && componentCount <= accuracy;
    })
    .map(({ value, key }) => ({
      value: value,
      key: value === 1 ? (key[0] as moment.RelativeTimeKey) : key,
    }))
    .map(({ value, key }) => {
      const finalTime = moment
        .localeData()
        .relativeTime(value, true, key, true);
      return finalTime;
    });

  const accuratedTime = times.join(' ');
  const maxUnit = times?.[0]?.split(' ')?.[1] as moment.unitOfTime.Base;

  return {
    maxUnit,
    accuratedTime,
    times,
  };
}
