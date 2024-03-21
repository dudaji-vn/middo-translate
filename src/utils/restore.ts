export const restoredState = (name: string) => {
  const isBrowser = typeof window !== 'undefined';
  if (!isBrowser) {
    return {};
  }
  const historyListItems = localStorage.getItem(name);
  try {
    const parsedHistoryListItems = historyListItems
      ? JSON.parse(historyListItems)
      : [];
    if (parsedHistoryListItems) {
      return parsedHistoryListItems;
    }
  } catch (error) {
    console.error('Error parsing history storage', error);
  }
  return {};
};
