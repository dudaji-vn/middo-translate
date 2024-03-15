import { Button } from '@/components/actions';
import { Switch } from '@/components/data-entry';
import { Spinner } from '@/components/feedback';
import { MentionSuggestion } from '@/components/mention-suggestion-options';
import { RichTextView } from '@/components/rich-text-view';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { useChatStore } from '@/features/chat/store';
import { translateText } from '@/services/languages.service';
import { Editor } from '@tiptap/react';
import { AnimatePresence, motion } from 'framer-motion';
import { PenIcon } from 'lucide-react';
import { useState } from 'react';
import { CircleFlag } from 'react-circle-flags';
import { useMessageEditor } from '..';
import { RichTextInput } from '../rich-text-input';
export interface TranslationHelperProps {}

export const TranslationHelper = (props: TranslationHelperProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);
  const { showTranslateOnType, toggleShowTranslateOnType } = useChatStore();
  const {
    contentEnglish,
    isContentEmpty,
    translating,
    srcLang,
    richText,
    setInputDisabled,
    setContentEnglish,
    userMentions,
  } = useMessageEditor();

  const suggestions = userMentions.map(
    (participant): MentionSuggestion => ({
      id: participant._id,
      label: participant.name,
      image: participant.avatar,
    }),
  );

  if (suggestions.length !== 0) {
    suggestions.unshift({
      label: 'Everyone',
      id: 'everyone',
      image: '',
    });
  }

  const handleStartEdit = () => {
    richText?.commands.blur();
    setIsEditing(true);
    setInputDisabled(true);
  };
  const handleCancel = () => {
    setIsEditing(false);
    setInputDisabled(false);
  };
  const handleConfirm = async () => {
    const content = editor?.getHTML() || '';
    const translated = await translateText(
      content,
      DEFAULT_LANGUAGES_CODE.EN,
      srcLang!,
    );
    setIsEditing(false);
    setInputDisabled(false);
    richText?.commands.setContent(translated);
    setContentEnglish(content);
  };
  const showHelper =
    showTranslateOnType &&
    !isContentEmpty &&
    srcLang !== DEFAULT_LANGUAGES_CODE.EN;

  return (
    <AnimatePresence mode="wait">
      {showHelper && (
        <div className="mb-2 w-full outline-none">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: 'backOut' }}
            className=""
          >
            <div className="rounded-xl bg-primary-100 ">
              <div className="flex items-center gap-3 p-3">
                <CircleFlag countryCode="gb" height="20" width="20" />
                <span className="text-sm font-medium text-neutral-600">
                  EN - Translate tool
                </span>
                {translating && <Spinner className="h-4 w-4 text-primary" />}
                <Switch
                  checked={showTranslateOnType}
                  onCheckedChange={toggleShowTranslateOnType}
                  className="ml-auto"
                />
              </div>
              <div className="flex px-3 pb-3 pt-1">
                {isEditing ? (
                  <div className="flex flex-1 flex-col">
                    <div
                      className={
                        'flex flex-1 rounded-xl border border-primary-500-main bg-white px-3 py-2'
                      }
                    >
                      <RichTextInput
                        autoFocus
                        onCreated={(editor) => setEditor(editor)}
                        className="max-h-[200px] w-full overflow-y-auto"
                        initialContent={contentEnglish}
                        suggestions={suggestions}
                      />
                    </div>
                    <div className="mt-2 flex justify-end gap-2">
                      <Button
                        shape="square"
                        size="xs"
                        onClick={handleCancel}
                        variant="ghost"
                        color="default"
                      >
                        Cancel
                      </Button>
                      <Button
                        shape="square"
                        size="xs"
                        type="button"
                        onClick={handleConfirm}
                        variant="default"
                        color="primary"
                      >
                        Save change
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="max-h-[200px] flex-1 overflow-y-auto">
                      {contentEnglish ? (
                        <RichTextView
                          mentionClassName="left"
                          content={contentEnglish}
                        />
                      ) : (
                        <p className="italic text-neutral-300">
                          Stop typing to see translation...
                        </p>
                      )}
                    </div>
                    <Button.Icon
                      disabled={translating || isContentEmpty}
                      type="button"
                      onClick={handleStartEdit}
                      variant="ghost"
                      color="default"
                      size="xs"
                    >
                      <PenIcon />
                    </Button.Icon>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
