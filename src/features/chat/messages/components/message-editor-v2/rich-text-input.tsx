import { Editor, EditorContent, useEditor } from '@tiptap/react';
import { forwardRef } from 'react';
import { useMessageEditor } from '.';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import Emoji, { gitHubEmojis } from '@tiptap-pro/extension-emoji';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import {
  MentionSuggestion,
  mentionSuggestionOptions,
} from '@/components/mention-suggestion-options';
import { useChatBox } from '@/features/chat/rooms/contexts';
import { EnterToSubmit } from '@/components/enter-to-submit';
import { useMediaUpload } from '@/components/media-upload';
export interface RichTextInputProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const RichTextInput = forwardRef<HTMLDivElement, RichTextInputProps>(
  ({ className }, ref) => {
    const { room } = useChatBox();
    const { handleClipboardEvent } = useMediaUpload();
    const { setContent, setIsContentEmpty, editorId, setRichText } =
      useMessageEditor();
    const suggestions = room?.participants.map(
      (participant): MentionSuggestion => ({
        id: participant._id,
        label: participant.name,
        image: participant.avatar,
      }),
    );
    const handleRichTextChange = (editor: Editor) => {
      setContent(editor.getHTML());
      setIsContentEmpty(editor.isEmpty);
    };
    const editor = useEditor({
      editorProps: {
        attributes: {
          class: 'prose max-w-none w-full focus:outline-none',
        },
        handlePaste: (_, e) => {
          handleClipboardEvent(e);
        },
      },

      onCreate: ({ editor }) => {
        setRichText(editor as Editor);
      },

      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: 'Type a message',
        }),
        Link.configure({
          validate: (href) => /^https?:\/\//.test(href),
          protocols: [
            {
              scheme: 'tel',
              optionalSlashes: true,
            },
          ],
          HTMLAttributes: {
            rel: 'noopener noreferrer',
            className: 'link',
            style: 'color: #007bff',
          },
        }),
        Mention.configure({
          renderHTML(props) {
            const { node } = props;
            return [
              'span',
              {
                class: 'mention',
                'data-type': 'mention',
                'data-id': node.attrs.id,
                'data-label': node.attrs.label,
              },

              `@${node.attrs.label}`,
            ];
          },
          suggestion: mentionSuggestionOptions(suggestions ?? []),
        }),
        EnterToSubmit.configure({
          onSubmit: () => {
            const submitButton = document.getElementById(
              'send-button-' + editorId,
            );
            submitButton?.click();
          },
        }),
        Emoji.configure({
          emojis: gitHubEmojis,
          enableEmoticons: true,
        }),
      ],
      onUpdate: ({ editor }) => {
        handleRichTextChange(editor as Editor);
      },
    });

    return <EditorContent className={className} editor={editor} />;
  },
);
RichTextInput.displayName = 'RichTextInput';
