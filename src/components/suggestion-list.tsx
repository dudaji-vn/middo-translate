import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import type { MentionSuggestion } from './mention-suggestion-options';
import { Avatar } from './data-display';

import { cn } from '@/utils/cn';

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
      <div className="rounded-lg border bg-white p-1 shadow-1">
        <ul className="gap-2">
          {props.items.map((item, index) => (
            <li
              key={item.id}
              onMouseDown={() => selectItem(index)}
              className={cn(
                'flex cursor-pointer items-center gap-1 rounded p-1 hover:bg-gray-100',
                selectedIndex === index && 'bg-gray-100',
              )}
            >
              {item.image && (
                <Avatar
                  src={item.image}
                  alt={item.label}
                  className="h-6 w-6 rounded-full"
                />
              )}
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    ) : null;
  },
);

SuggestionList.displayName = 'SuggestionList';

export default SuggestionList;
