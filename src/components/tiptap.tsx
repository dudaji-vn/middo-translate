'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import {
  MentionSuggestion,
  mentionSuggestionOptions,
} from './mention-suggestion-options';
import { useChatBox } from '@/features/chat/rooms/contexts';
import { EnterToSubmit } from './enter-to-submit';
import { ROUTE_NAMES } from '@/configs/route-name';
type TiptapProps = {
  onEnter?: (content: string) => void;
  onUpdate?: (editor: Editor) => void;
  setRichText?: (richText: Editor | null) => void;
};

export const Tiptap = ({ onEnter, onUpdate, setRichText }: TiptapProps) => {
  const { room } = useChatBox();
  const suggestions = room?.participants.map(
    (participant): MentionSuggestion => ({
      id: participant._id,
      label: participant.name,
      image: participant.avatar,
    }),
  );
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'prose max-w-none w-full focus:outline-none',
      },
    },

    extensions: [
      StarterKit,
      Mention.configure({
        renderHTML(props) {
          const { node } = props;
          return [
            'a',
            {
              class: 'mention',
              'data-id': node.attrs.id,
              href: `${ROUTE_NAMES.ONLINE_CONVERSATION}/${node.attrs.id}`,
            },

            `@${node.attrs.label}`,
          ];
        },
        suggestion: mentionSuggestionOptions(suggestions ?? []),
      }),
      EnterToSubmit.configure({
        onSubmit: ({ editor }: { editor: Editor }) => {
          onEnter?.(editor.getHTML());
        },
      }),
    ],
    onUpdate: ({ editor }) => {
      onUpdate?.(editor as Editor);
    },
  });

  return <EditorContent editor={editor} />;
};
