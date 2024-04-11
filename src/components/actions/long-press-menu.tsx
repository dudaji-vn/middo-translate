import {
  PropsWithChildren,
  cloneElement,
  createContext,
  forwardRef,
  useContext,
  useEffect,
} from 'react';

import { Button } from '@/components/actions';
import { cn } from '@/utils/cn';
import { useLongPress } from 'use-long-press';
import { useBoolean } from 'usehooks-ts';
import { Drawer, DrawerContent } from '../data-display/drawer';

type LongPressMenuProps = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  bind: ReturnType<typeof useLongPress>;
  onOpenChange?: (isOpen: boolean) => void;
  hasBackdrop?: boolean;
};

const LongPressMenuContext = createContext<LongPressMenuProps | undefined>(
  undefined,
);

export const LongPressMenu = ({
  children,
  hasBackdrop = true,
  onPressed,
  onOpenChange,
  isOpen,
}: PropsWithChildren & {
  isOpen?: boolean;
  hasBackdrop?: boolean;
  onPressed?: () => void;
  onOpenChange?: (isOpen: boolean) => void;
}) => {
  const { setFalse, setTrue, value, setValue } = useBoolean(false);
  const bind = useLongPress((event) => {
    onPressed && onPressed();
    setTrue();
    navigator?.vibrate(8);
    onOpenChange && onOpenChange(true);
  });

  const handleOpen = () => {
    setTrue();
    onOpenChange && onOpenChange(true);
  };
  const handleClose = () => {
    setFalse();
    onOpenChange && onOpenChange(false);
  };

  useEffect(() => {
    if (isOpen) {
      handleOpen();
    } else {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <LongPressMenuContext.Provider
      value={{
        isOpen: value,
        open: handleOpen,
        close: handleClose,
        bind,
        hasBackdrop,
        onOpenChange: (value) => {
          setValue(value);
          onOpenChange && onOpenChange(value);
        },
      }}
    >
      <> {children}</>
    </LongPressMenuContext.Provider>
  );
};

export const useLongPressMenu = () => {
  const context = useContext(LongPressMenuContext);
  if (context === undefined) {
    throw new Error(
      'useLongPressMenu must be used within a LongPressMenuContext',
    );
  }
  return context;
};

export const Trigger = (
  props: PropsWithChildren<React.HTMLProps<HTMLDivElement>>,
) => {
  const { bind } = useLongPressMenu();
  return <div {...bind()} {...props} />;
};

export const Menu = ({
  outsideComponent,
  children,
}: PropsWithChildren<React.HTMLProps<HTMLDivElement>> & {
  outsideComponent?: React.ReactNode;
}) => {
  const { isOpen, close, onOpenChange } = useLongPressMenu();
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} onClose={close}>
      <DrawerContent>
        {outsideComponent && (
          <div className="pointer-events-none absolute top-0 w-full -translate-y-full">
            {outsideComponent}
          </div>
        )}
        <div className="justify-start pb-3 pt-1"> {children}</div>
      </DrawerContent>
    </Drawer>
  );
};

type ItemProps = {} & typeof Button;

const Item = forwardRef<
  React.ElementRef<ItemProps>,
  React.ComponentPropsWithoutRef<ItemProps>
>(
  (
    { className, startIcon, title, color, onClick, children, ...props },
    ref,
  ) => {
    const { close } = useLongPressMenu();

    return (
      <button
        ref={ref}
        {...props}
        className={cn(
          'hover:bg-blue-gray-50 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:text-blue-gray-900 flex h-14 w-full cursor-pointer select-none items-center gap-2 pb-2 pl-5 pt-[9px] text-start leading-tight transition-all  hover:bg-neutral-100 focus:bg-neutral-100 active:bg-neutral-100',
          className,
        )}
        onClick={(e) => {
          onClick && onClick(e);
          close();
        }}
      >
        {startIcon && (
          <>
            {cloneElement(startIcon, {
              size: 20,
              className: cn('mr-2', color && `text-${color}`),
            })}
          </>
        )}

        <span className={cn('text-base', color === 'error' && 'text-error')}>
          {children}
        </span>
      </button>
    );
  },
);

Item.displayName = 'Item';

export interface CloseTriggerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CloseTrigger = forwardRef<HTMLDivElement, CloseTriggerProps>(
  (props, ref) => {
    const { close } = useLongPressMenu();
    return <div ref={ref} {...props} onClick={close} />;
  },
);
CloseTrigger.displayName = 'CloseTrigger';

LongPressMenu.Trigger = Trigger;
LongPressMenu.Menu = Menu;
LongPressMenu.Item = Item;
LongPressMenu.CloseTrigger = CloseTrigger;
