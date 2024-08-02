import type { SuggestionProps } from '@tiptap/suggestion';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { cn } from '@/utils/cn';

import { isMobile as isMobileDevice } from 'react-device-detect';
import { CommandSuggestion, SuggestionListRef } from './command.types';
import { Avatar } from '@/components/data-display';
import { BotIcon } from 'lucide-react';

export type SuggestionListProps = SuggestionProps<CommandSuggestion>;

export const CommandSuggestionList = forwardRef<
  SuggestionListRef,
  SuggestionListProps
>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    if (index >= props.items.length) {
      return;
    }
    const suggestion = props.items[index];
    props.command(suggestion);
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length,
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter' || event.key === 'Tab') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));
  props.items.map;

  return props.items.length > 0 ? (
    <div className="w-full overflow-hidden rounded-xl border bg-white py-1 shadow-1  dark:bg-neutral-900 ">
      <div className="flex max-h-60 w-full flex-col space-y-1 overflow-y-auto px-1">
        {props.items.map((item, index) => (
          <Item
            key={item.id}
            item={item}
            index={index}
            isSelected={selectedIndex === index}
            selectItem={selectItem}
          />
        ))}
      </div>
    </div>
  ) : null;
});

export const Item = ({
  item,
  index,
  isSelected,
  selectItem,
}: {
  item: CommandSuggestion;
  index: number;
  isSelected: boolean;
  selectItem: (index: number) => void;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (isSelected && ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [isSelected]);
  return (
    <button
      ref={ref}
      key={item.id}
      onClick={() => selectItem(index)}
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 md:py-2',
        isSelected
          ? 'md:bg-primary-100 md:text-white dark:md:bg-primary-800'
          : 'active:!bg-primary md:hover:bg-primary-200 md:dark:hover:bg-neutral-800 dark:md:active:!bg-neutral-700',
      )}
    >
      {/* {item?.image && (
        <Avatar
          src={item.image}
          alt={item.label}
          className="h-8 w-8 rounded-full"
        />
      )} */}
      <div className="flex size-8 items-center justify-center rounded-full bg-primary">
        <BotIcon size={20} />
      </div>
      <div className="flex flex-col justify-start">
        <span className="truncate text-start font-semibold text-primary">
          {item.label}
        </span>
        {item?.description && (
          <span className="text-sm font-light text-neutral-500 dark:text-neutral-400">
            {item.description}
          </span>
        )}
      </div>
    </button>
  );
};

CommandSuggestionList.displayName = 'CommandSuggestionList';
