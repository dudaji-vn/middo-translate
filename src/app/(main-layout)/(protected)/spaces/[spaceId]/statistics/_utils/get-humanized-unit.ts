export const getProposedTimeUnit = (data: { value: number }[] = []) => {
  const average =
    data.length > 0
      ? data.reduce((acc, item) => acc + item.value, 0) / data.length
      : 0;
  if (average >= 60 * 60 * 24 * 1000) {
    return {
      unit: 'DAY', // "day
      ratio: 60 * 60 * 24 * 1000,
    };
  }
  if (average >= 60 * 60 * 1000) {
    return {
      unit: 'HOUR', // "hour
      ratio: 60 * 60 * 1000,
    };
  }
  if (average >= 60 * 1000) {
    return {
      unit: 'MINUTE', // "minute
      ratio: 60 * 1000,
    };
  }
  if (average >= 1000) {
    return {
      unit: 'SECOND', // "second
      ratio: 1000,
    };
  }
  return {
    unit: 'MILLISECOND',
    ratio: 1,
  };
};
