import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { MentionSuggestion } from './mention-suggestion-options';
import { Avatar } from './data-display';

import { cn } from '@/utils/cn';
import { Users2Icon } from 'lucide-react';

export type SuggestionListRef = {
  onKeyDown: NonNullable<
    ReturnType<
      NonNullable<SuggestionOptions<MentionSuggestion>['render']>
    >['onKeyDown']
  >;
};

export type SuggestionListProps = SuggestionProps<MentionSuggestion>;

const SuggestionList = forwardRef<SuggestionListRef, SuggestionListProps>(
  (props, ref) => {
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
      <div className=" w-72 overflow-hidden rounded-xl border bg-white dark:bg-neutral-900  py-1 shadow-1">
        <ul className="max-h-60 w-full space-y-1 overflow-y-auto px-1">
          {props.items.map((item, index) => (
            <Item
              key={item.id}
              item={item}
              index={index}
              isSelected={index === selectedIndex}
              selectItem={selectItem}
            />
          ))}
        </ul>
      </div>
    ) : null;
  },
);

const Item = ({
  item,
  index,
  isSelected,
  selectItem,
}: {
  item: MentionSuggestion;
  index: number;
  isSelected: boolean;
  selectItem: (index: number) => void;
}) => {
  const ref = useRef<HTMLLIElement>(null);
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
    <li
      ref={ref}
      key={item.id}
      onMouseDown={() => selectItem(index)}
      className={cn(
        'flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 ',
        isSelected ? 'bg-primary text-white' : 'hover:bg-primary-200 dark:hover:bg-neutral-800',
      )}
    >
      {item?.image ? (
        <Avatar
          src={item.image}
          alt={item.label}
          className="h-6 w-6 rounded-full"
        />
      ) : (
        <div className="flex size-6 items-center justify-center p-1">
          <Users2Icon />
        </div>
      )}
      <span className="truncate"> {item.label}</span>
    </li>
  );
};

SuggestionList.displayName = 'SuggestionList';

export default SuggestionList;
