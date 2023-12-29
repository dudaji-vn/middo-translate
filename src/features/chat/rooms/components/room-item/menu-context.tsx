'use client';

import { LogOut, Trash } from 'lucide-react';
import { PropsWithChildren, createContext, useContext } from 'react';

import { Button } from '@/components/actions';
import { Room } from '@/features/chat/rooms/types';
import { useBoolean } from 'usehooks-ts';
import { useLongPress } from 'use-long-press';

interface InboxMenuContextProps {}

export const InboxMenuContext = createContext<InboxMenuContextProps>(
  {} as InboxMenuContextProps,
);

export const InboxMenuProvider = ({
  children,
  room: _room,
}: PropsWithChildren<{ room: Room }>) => {
  const { setFalse, setTrue, toggle, value } = useBoolean(false);
  const bind = useLongPress(() => {
    setTrue();
  });

  return (
    <InboxMenuContext.Provider value={{} as InboxMenuContextProps}>
      <div {...bind()}>{children}</div>
      {value && (
        <div
          onClick={setFalse}
          className="fixed left-0 top-0 z-50 h-screen w-screen bg-black/30"
        >
          <div className="absolute bottom-0 z-10 w-full border-t bg-background">
            <Button
              startIcon={<LogOut className="h-4 w-4" />}
              color="default"
              variant="ghost"
              shape="square"
              size="lg"
              className="w-full rounded-none"
            >
              Leave
            </Button>
            <div className="h-[1px] w-full bg-neutral-50"></div>
            <Button
              startIcon={<Trash className="h-4 w-4" />}
              color="error"
              variant="ghost"
              shape="square"
              size="lg"
              className="w-full rounded-none"
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </InboxMenuContext.Provider>
  );
};

export const useInboxMenu = () => {
  const context = useContext(InboxMenuContext);
  if (!context) {
    throw new Error('useInboxMenu must be used within InboxMenuProvider');
  }
  return context;
};
