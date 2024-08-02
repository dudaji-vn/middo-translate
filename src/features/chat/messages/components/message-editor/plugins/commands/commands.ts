import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion, { SuggestionProps } from '@tiptap/suggestion';
import { COMMAND_PLUGINS_KEY } from './command.types';

export const CommandsExtension = Extension.create({
  name: COMMAND_PLUGINS_KEY,
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, command }: SuggestionProps) => {
          command({ editor, range });
        },
        pluginKey: new PluginKey(COMMAND_PLUGINS_KEY),
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
