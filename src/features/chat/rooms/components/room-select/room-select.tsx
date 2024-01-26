import {
  PropsWithChildren,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Room } from '../../types';
import { RoomItem, RoomItemAvatar } from '../room-item';
import { CheckIcon, XIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/auth.store';
import { generateRoomDisplay } from '../../utils';

export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  items: Room[];
  onSelectChange?: (ids: string[]) => void;
}
export interface SelectContextProps {
  items: Room[];
  selectedItems: Room[];
  handleSelect: (item: Room) => void;
  handleUnSelect: (item: Room) => void;
}
export const SelectContext = createContext<SelectContextProps | undefined>(
  undefined,
);
export const useSelect = () => {
  const context = useContext(SelectContext);
  if (context === undefined) {
    throw new Error('useSelect must be used within a Select');
  }
  return context;
};

export const Select = (props: SelectProps) => {
  const [selectedItems, setSelectedItems] = useState<Room[]>([]);
  const handleSelect = (item: Room) => {
    const isExist = selectedItems.find((u) => u._id === item._id);
    if (isExist) {
      setSelectedItems((prev) => prev.filter((u) => u._id !== item._id));
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
  };
  const handleUnSelect = (item: Room) => {
    setSelectedItems((prev) => prev.filter((u) => u._id !== item._id));
  };

  useEffect(() => {
    props.onSelectChange?.(selectedItems.map((u) => u._id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  return (
    <SelectContext.Provider
      value={{
        items: props.items,
        selectedItems,
        handleSelect,
        handleUnSelect,
      }}
    >
      {props.children}
    </SelectContext.Provider>
  );
};
Select.displayName = 'Select';

type SelectItemProps = {
  item: Room;
} & React.HTMLAttributes<HTMLDivElement>;
export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ item, ...props }, ref) => {
    const { selectedItems, handleSelect } = useSelect();

    const isSelected = useMemo(() => {
      return selectedItems.find((u) => u._id === item._id);
    }, [selectedItems, item._id]);

    return (
      <div ref={ref} {...props} onClick={() => handleSelect(item)}>
        <RoomItem
          disabledAction
          showMembersName
          showTime={false}
          disabledRedirect
          data={item}
          className="pl-2"
          rightElement={
            <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full border border-stroke p-[0.5px]">
              {isSelected && (
                <CheckIcon className="h-3 w-3 rounded-full bg-primary text-background" />
              )}
            </div>
          }
        />
      </div>
    );
  },
);

SelectItem.displayName = 'SelectItem';

export const SelectList = (props: PropsWithChildren) => {
  const { items } = useSelect();
  return (
    <div>
      {items.map((item) => {
        return <SelectItem key={item._id} item={item} />;
      })}
    </div>
  );
};

SelectList.displayName = 'SelectList';

type SelectedItemProps = {
  item: Room;
} & React.HTMLAttributes<HTMLDivElement>;

export const SelectedItem = forwardRef<HTMLDivElement, SelectedItemProps>(
  ({ item, ...props }, ref) => {
    const { handleUnSelect } = useSelect();
    const currentUser = useAuthStore((s) => s.user)!;
    const currentUserId = currentUser?._id;

    const room = useMemo(
      () => generateRoomDisplay(item, currentUserId, true),
      [currentUserId, item],
    );

    return (
      <div
        ref={ref}
        {...props}
        onClick={() => handleUnSelect(room)}
        className="flex max-w-[60px] shrink-0 cursor-pointer flex-col gap-1 overflow-hidden"
      >
        <div className="relative flex justify-center">
          <RoomItemAvatar room={room} />
          <div className="absolute right-0 top-0 rounded-full border-[0.1px] bg-background">
            <XIcon className="size-3.5" />
          </div>
        </div>
        <Typography className="truncate">{room.name}</Typography>
      </div>
    );
  },
);

SelectedItem.displayName = 'SelectedItem';

export const SelectedList = forwardRef<HTMLDivElement>((props, ref) => {
  const { selectedItems, handleUnSelect } = useSelect();
  const selectedRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollTo({
        left: selectedRef.current?.scrollWidth,
        behavior: 'smooth',
      });
    }
  }, [selectedItems]);
  return (
    <div
      className={cn(
        selectedItems.length > 0 && 'w-full overflow-hidden border-b pb-1',
      )}
    >
      <AnimatePresence>
        <motion.div
          initial={{
            opacity: 0,
            height: 0,
          }}
          animate={{
            opacity: 1,
            height: 'auto',
          }}
          exit={{
            opacity: 0,
            height: 0,
          }}
          ref={selectedRef}
          className="flex gap-8 overflow-x-auto overflow-y-hidden"
        >
          <AnimatePresence>
            {selectedItems.map((item) => (
              <motion.div
                className="mt-1"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                key={item._id}
              >
                <SelectedItem
                  onClick={() => handleUnSelect(item)}
                  item={item}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

SelectedList.displayName = 'SelectedList';
Select.List = SelectList;
Select.Listed = SelectedList;
Select.Item = SelectItem;
