import { Extension } from '@tiptap/core';
import { Editor } from '@tiptap/react';
type EnterToSubmitOptions = {
  onSubmit: ({ editor }: { editor: Editor }) => void;
};
export const EnterToSubmit = Extension.create({
  name: 'enterToSubmit',
  addOptions() {
    return {
      onSubmit: () => {},
    } as EnterToSubmitOptions;
  },
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const mentionState = (
          editor.state as unknown as {
            [key: string]: {
              active: boolean;
            };
          }
        )['mention$'];
        if (mentionState.active) {
          return false;
        }
        const { onSubmit } = this.options as EnterToSubmitOptions;
        onSubmit({ editor: editor as Editor });
        return true;
      },
      'Shift-Enter': () => {
        const editor = this.editor;
        const isList =
          editor.isActive('bulletList') || editor.isActive('orderedList');
        if (isList) {
          editor.chain().focus().splitListItem('listItem').run();
          return true;
        } else {
          this.editor.commands.first(({ commands }) => [
            () => commands.newlineInCode(),
            () => commands.createParagraphNear(),
            () => commands.liftEmptyBlock(),
            () => commands.splitBlock(),
          ]);
          return true;
        }
      },
    };
  },
});
