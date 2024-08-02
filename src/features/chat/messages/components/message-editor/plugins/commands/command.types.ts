import { SuggestionOptions } from '@tiptap/suggestion';
export const COMMAND_PLUGINS_KEY = 'commands';
export type CommandSuggestion = {
  id: string;
  image?: string;
  label: string;
  description?: string;
};

export type SuggestionListRef = {
  onKeyDown: NonNullable<
    ReturnType<
      NonNullable<SuggestionOptions<CommandSuggestion>['render']>
    >['onKeyDown']
  >;
};
