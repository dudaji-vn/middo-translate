import { Editor } from '@tiptap/react';
import { useMemo } from 'react';
import { MentionSuggestion } from './mention-options';
import { MentionItem } from './mention-list';

type MobileMentionProps = {
  editor: Editor;
  suggestions: MentionSuggestion[];
  onSelect: (suggestion: MentionSuggestion) => void;
};
export const MobileMention = ({
  editor,
  suggestions,
  onSelect,
}: MobileMentionProps) => {
  const { active, query, range } = useMemo(() => {
    return (
      editor?.state as unknown as {
        [key: string]: {
          active: boolean;
          query: string | null;
          range: { from: number; to: number };
        };
      }
    )['mention$'];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.state]);

  const filteredSuggestions = useMemo(() => {
    if (!query) return suggestions;
    return suggestions.filter((suggestion) =>
      suggestion.label.toLowerCase().includes(query.toLowerCase()),
    );
  }, [suggestions, query]);

  const selectItem = (index: number) => {
    const selectedSuggestion = filteredSuggestions[index];
    const nodeAfter = editor.view.state.selection.$to.nodeAfter;
    const overrideSpace = nodeAfter?.text?.startsWith(' ');
    editor.commands.deleteRange({
      from: range.from,
      to: range.to,
    });
    editor
      .chain()
      .focus()
      .insertContentAt(overrideSpace ? range.from + 1 : range.from, [
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
    onSelect(selectedSuggestion);
    window?.getSelection()?.collapseToEnd();
  };

  if (!active) return null;
  return (
    <div className="relative mb-[18px] w-full">
      <div className="absolute left-0 top-0 w-full -translate-y-full overflow-hidden rounded-xl  border shadow-1">
        <div className="no-scrollbar flex max-h-52 w-full flex-1 flex-col space-y-1 overflow-y-auto bg-white dark:bg-neutral-900">
          {filteredSuggestions.map((suggestion, index) => {
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
