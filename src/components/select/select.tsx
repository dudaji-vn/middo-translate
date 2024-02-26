import {
  PropsWithChildren,
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useState,
} from 'react';
export type Item = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
};
export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  items: Item[];
}
export interface SelectContextProps {
  items: Item[];
  selectedIds?: string[];
  handleSelect?: (id: string) => void;
  handleUnSelect?: (id: string) => void;
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const handleSelect = (id: string) => {
    setSelectedIds((prev) => {
      let newSelectedIds = [];
      const index = prev.findIndex((u) => u === id);
      if (index === -1) {
        newSelectedIds = [...prev, id];
      } else {
        newSelectedIds = [...prev.slice(0, index), ...prev.slice(index + 1)];
      }

      return newSelectedIds;
    });
  };
  const handleUnSelect = (id: string) => {
    setSelectedIds((prev) => prev.filter((u) => u !== id));
  };

  return (
    <SelectContext.Provider
      value={{
        items: props.items,
        selectedIds,
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
  item: Item;
  isSelected: boolean;
};
export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ item, isSelected, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        SelectItem
      </div>
    );
  },
);

SelectItem.displayName = 'SelectItem';

export const SelectList = (props: PropsWithChildren) => {
  const { items, selectedIds } = useSelect();
  return (
    <div>
      {items.map((item) => {
        const isSelected = selectedIds?.includes(item.id) ?? false;
        return <SelectItem key={item.id} item={item} isSelected={isSelected} />;
      })}
    </div>
  );
};

SelectList.displayName = 'SelectList';

type SelectedItemProps = {
  item: Item;
};

export const SelectedItem = forwardRef<HTMLDivElement, SelectedItemProps>(
  ({ item, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        SelectedItem
      </div>
    );
  },
);

SelectedItem.displayName = 'SelectedItem';

export const SelectedList = forwardRef<HTMLDivElement>((props, ref) => {
  const { items, selectedIds } = useSelect();
  const selectedItems = useMemo(() => {
    return items.filter((item) => selectedIds?.includes(item.id));
  }, [items, selectedIds]);
  return (
    <div ref={ref} {...props}>
      {selectedItems.map((item) => (
        <SelectedItem key={item.id} item={item} />
      ))}
    </div>
  );
});

SelectedList.displayName = 'SelectedList';
Select.List = SelectList;
Select.Listed = SelectedList;
