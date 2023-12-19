import {
  PropsWithChildren,
  createContext,
  forwardRef,
  useContext,
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
};

const LongPressMenuContext = createContext<LongPressMenuProps | undefined>(
  undefined,
);

export const LongPressMenu = ({ children }: PropsWithChildren) => {
  const { setFalse, setTrue, value } = useBoolean(false);
  const bind = useLongPress(() => {
    setTrue();
  });
  return (
    <LongPressMenuContext.Provider
      value={{
        isOpen: value,
        open: setTrue,
        close: setFalse,
        bind,
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
  return <button {...bind()}>{props.children}</button>;
};

export const Menu = (
  props: PropsWithChildren<React.HTMLProps<HTMLDivElement>>,
) => {
  const { isOpen, close } = useLongPressMenu();
  return (
    <Sheet isOpen={isOpen} onClose={close}>
      <Sheet.Container className="!h-fit !rounded-t-3xl pb-6">
        <Sheet.Header />
        <Sheet.Content>
          <div className="flex justify-evenly"> {props.children}</div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={close} className="!bg-black/60" />
    </Sheet>
  );

  // return isOpen ? (
  //   <div className="fixed left-0 top-0 z-50 flex h-screen w-screen flex-col bg-black/60">
  //     <div onClick={close} className="flex-1"></div>
  //     <div className="absolute bottom-0 z-10 w-full overflow-hidden rounded-t-3xl border-t bg-background pb-6">
  //       <div className="mx-auto my-3 h-1 w-8 rounded-full bg-colors-neutral-100"></div>
  //       <div className="flex justify-evenly"> {props.children}</div>
  //     </div>
  //   </div>
  // ) : null;
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
>(({ className, title, color, ...props }, ref) => (
  <div className="flex flex-col items-center">
    <Button.Icon
      ref={ref}
      className={cn(className)}
      color={color || 'default'}
      variant="ghost"
      size="lg"
      {...props}
    />
    <span className={cn('text-sm', color === 'error' && 'text-error')}>
      {title}
    </span>
  </div>
));

const Spacer = () => (
  <div className="h-[1px] w-full bg-colors-neutral-50"></div>
);

Item.displayName = 'Item';

LongPressMenu.Trigger = Trigger;
LongPressMenu.Menu = Menu;
LongPressMenu.Item = Item;
LongPressMenu.Spacer = Spacer;
