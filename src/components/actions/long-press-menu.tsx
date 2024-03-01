import {
  PropsWithChildren,
  createContext,
  forwardRef,
  useContext,
  useEffect,
} from 'react';

import { Button } from '@/components/actions';
import Sheet from 'react-modal-sheet';
import { cn } from '@/utils/cn';
import { useBoolean } from 'usehooks-ts';
import { useLongPress } from 'use-long-press';

type LongPressMenuProps = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  bind: ReturnType<typeof useLongPress>;
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
  const { setFalse, setTrue, value } = useBoolean(false);
  const bind = useLongPress((event) => {
    onPressed && onPressed();
    setTrue();
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

export const Menu = (
  props: PropsWithChildren<React.HTMLProps<HTMLDivElement>>,
) => {
  const { isOpen, close, hasBackdrop } = useLongPressMenu();
  return (
    <Sheet isOpen={isOpen} onClose={close}>
      <Sheet.Container className="!h-fit !rounded-t-3xl pb-6">
        <Sheet.Header />
        <Sheet.Content>
          <div className="flex justify-evenly"> {props.children}</div>
        </Sheet.Content>
      </Sheet.Container>
      {hasBackdrop ? (
        <Sheet.Backdrop onTap={close} className="!bg-black/60" />
      ) : (
        <></>
      )}
    </Sheet>
  );
};

const Item = forwardRef<
  React.ElementRef<
    typeof Button.Icon & {
      title: string;
    }
  >,
  React.ComponentPropsWithoutRef<
    typeof Button.Icon & {
      title: string;
    }
  >
>(({ className, title, color, onClick, ...props }, ref) => {
  const { close } = useLongPressMenu();
  return (
    <div className="flex flex-col items-center">
      <Button.Icon
        ref={ref}
        className={cn(className)}
        color={color || 'default'}
        variant="ghost"
        size="xs"
        {...props}
        onClick={(e) => {
          onClick && onClick(e);
          close();
        }}
      />
      <span className={cn('text-sm', color === 'error' && 'text-error')}>
        {title}
      </span>
    </div>
  );
});

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
