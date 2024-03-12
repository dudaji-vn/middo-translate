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
        editor.commands.clearContent();
        return true;
      },
      'Shift-Enter': () => {
        const editor = this.editor;

        const bulletList = editor.isActive('bulletList');
        if (bulletList) {
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
