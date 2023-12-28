import { createContext, useContext } from 'react';

import { InboxSides } from '../../types';

interface InboxContextProps {
  currentTab: InboxSides;
  setCurrentTab: (tab: InboxSides) => void;
  backToDefault: () => void;
}

export const InboxContext = createContext<InboxContextProps | undefined>({
  currentTab: 'default',
  setCurrentTab: () => {},
  backToDefault: () => {},
});

export const useInboxContext = () => {
  const context = useContext(InboxContext);
  if (!context) {
    throw new Error(
      'useInboxContext must be used within a InboxContextProvider',
    );
  }
  return context;
};
