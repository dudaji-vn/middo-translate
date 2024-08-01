import { Editor } from '@tiptap/react';
import { MentionSuggestion } from './mention-suggestion-options';
import { MentionItem } from './suggestion-list';
import { useMemo } from 'react';

type MobileMentionProps = {
  editor: Editor | null;
  suggestions: MentionSuggestion[];
  onSelect: (suggestion: MentionSuggestion) => void;
};
export const MobileMention = ({
  editor,
  suggestions,
  onSelect,
}: MobileMentionProps) => {
  const isMentionTrigger = useMemo(() => {
    if (!editor) return false;
    const mentionState = (
      editor.state as unknown as {
        [key: string]: {
          active: boolean;
        };
      }
    )['mention$'];
    return mentionState.active;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.state]);
  const selectItem = (index: number) => {
    if (!editor) return;
    const selectedSuggestion = suggestions[index];
    const { to } = editor.state.selection;
    editor.commands.deleteRange({ from: to - 1, to });
    const nodeAfter = editor.view.state.selection.$to.nodeAfter;
    const overrideSpace = nodeAfter?.text?.startsWith(' ');
    editor
      .chain()
      .focus()
      .insertContentAt(overrideSpace ? to : to - 1, [
        {
          type: 'mention',
          attrs: {
            id: selectedSuggestion.id,
            label: selectedSuggestion.label,
          },
        },
        {
          type: 'text',
          text: ' ',
        },
      ])
      .run();
    window?.getSelection()?.collapseToEnd();
  };
  if (!isMentionTrigger) return null;
  return (
    <div className="relative mb-[18px] w-full">
      <div className="absolute left-0 top-0 w-full -translate-y-full overflow-hidden rounded-xl  border shadow-1">
        <div className="no-scrollbar flex h-40 w-full flex-1 flex-col space-y-1 overflow-y-auto bg-white dark:bg-neutral-900">
          {suggestions.map((suggestion, index) => {
            return (
              <MentionItem
                key={suggestion.id}
                item={suggestion}
                index={index}
                isSelected={false}
                selectItem={selectItem}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
