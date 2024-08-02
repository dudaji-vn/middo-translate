import { ReactRenderer } from '@tiptap/react';
import tippy, { type Instance as TippyInstance } from 'tippy.js';

const DOM_RECT_FALLBACK: DOMRect = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
  toJSON() {
    return {};
  },
};
import { isMobile as isMobileDevice } from 'react-device-detect';
import { SuggestionOptions } from '@tiptap/suggestion';
import { CommandSuggestion, SuggestionListRef } from './command.types';
import { CommandSuggestionList } from './command-list';

export type MentionOptions = {
  HTMLAttributes: Record<string, any>;
  suggestion: Omit<SuggestionOptions, 'editor'>;
};

export const commandOptions = (
  _items: CommandSuggestion[],
): MentionOptions['suggestion'] => {
  return {
    items: ({ query }): CommandSuggestion[] => {
      return _items
        .map((item) => ({
          label: item.label,
          id: item.id,
          image: item.image,
          description: item?.description,
        }))
        .filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase()),
        );
    },

    render: () => {
      let component: ReactRenderer<SuggestionListRef> | undefined;
      let popup: TippyInstance | undefined;

      return {
        onStart: (props) => {
          component = new ReactRenderer(CommandSuggestionList, {
            props,
            editor: props.editor,
          });

          if (isMobileDevice) return;

          popup = tippy(document.querySelectorAll('.mention-bar'), {
            appendTo: 'parent',
            content: component.element,
            onShow({ popper, reference }) {
              popper.style.width =
                reference.getBoundingClientRect().width + 'px';
            },
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            sticky: 'reference',
            placement: 'bottom-start',
            maxWidth: 'none',
          })[0];
        },

        onUpdate(props) {
          component?.updateProps(props);
          !isMobileDevice &&
            popup?.setProps({
              getReferenceClientRect: () =>
                props.clientRect?.() ?? DOM_RECT_FALLBACK,
            });
        },

        onKeyDown(props) {
          if (props.event.key === 'Escape') {
            popup?.hide();
            return true;
          }

          if (!component?.ref) {
            return false;
          }

          return component.ref.onKeyDown(props);
        },

        onExit() {
          popup?.destroy();
          component?.destroy();
          // Remove references to the old popup and component upon destruction/exit.
          // (This should prevent redundant calls to `popup.destroy()`, which Tippy
          // warns in the console is a sign of a memory leak, as the `suggestion`
          // plugin seems to call `onExit` both when a suggestion menu is closed after
          // a user chooses an option, *and* when the editor itself is destroyed.)
          popup = undefined;
          component = undefined;
        },
      };
    },
  };
};
