import { Button } from '@/components/actions';
import { Switch } from '@/components/data-entry';
import { Spinner } from '@/components/feedback';
import { MentionSuggestion } from '@/components/mention-suggestion-options';
import { RichTextView } from '@/components/rich-text-view';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { useChatStore } from '@/features/chat/store';
import { detectLanguage, translateText } from '@/services/languages.service';
import { Editor, EditorContent } from '@tiptap/react';
import { AnimatePresence, motion } from 'framer-motion';
import { PenIcon } from 'lucide-react';
import { useId, useState } from 'react';
import { CircleFlag } from 'react-circle-flags';
import { useTranslation } from 'react-i18next';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { isEqual } from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { useEditor } from './use-editor';
import { useAppStore } from '@/stores/app.store';
import { useDebounce } from 'usehooks-ts';
const DEBOUNCE_TIME = 1000;
export interface TranslationHelperProps {
  mentionSuggestionOptions: MentionSuggestion[];
  editor: Editor | null;
  onStartedEdit?: () => void;
  onFinishedEdit?: () => void;
}

export const TranslationHelper = ({
  mentionSuggestionOptions,
  editor: rootEditor,
  onStartedEdit,
  onFinishedEdit,
}: TranslationHelperProps) => {
  const isMobile = useAppStore((s) => s.isMobile);
  const [isEditing, setIsEditing] = useState(false);
  const handleEnter = () => {
    const confirmButton = document.getElementById(confirmButtonId);
    confirmButton?.click();
  };
  const editor = useEditor({
    mentionSuggestions: mentionSuggestionOptions,
    enterToSubmit: !isMobile,
    onEnterTrigger: handleEnter,
  });
  const { showTranslateOnType, toggleShowTranslateOnType } = useChatStore();
  const { t } = useTranslation('common');
  const [srcLang, setSrcLang] = useState<string | null>(null);
  const isRootEditorEmpty = rootEditor?.isEmpty;

  // Use debounce to prevent too many requests
  const htmlDebounce = useDebounce(rootEditor?.getHTML(), DEBOUNCE_TIME);
  const textDebounce = useDebounce(rootEditor?.getText(), DEBOUNCE_TIME);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['translation-helper', htmlDebounce],
    queryFn: async () => {
      const plainText = (textDebounce || '').trim();
      const srcLang = await detectLanguage(plainText);
      const translated = await translateText(
        htmlDebounce || '',
        srcLang,
        DEFAULT_LANGUAGES_CODE.EN,
      );
      setSrcLang(srcLang);
      return translated;
    },
    enabled: !isRootEditorEmpty,
    staleTime: Infinity,
    keepPreviousData: true,
  });

  const handleStartEdit = () => {
    editor?.commands.setContent(data);
    editor?.commands.focus('end');
    setIsEditing(true);
    onStartedEdit?.();
  };
  const handleCancel = () => {
    setIsEditing(false);
    onFinishedEdit?.();
  };
  const handleConfirm = async () => {
    setIsEditing(false);
    const content = editor?.getHTML() || '';
    const translated = await translateText(
      content,
      DEFAULT_LANGUAGES_CODE.EN,
      srcLang!,
    );
    onFinishedEdit?.();
    rootEditor?.commands.setContent(translated);
  };
  const showHelper = showTranslateOnType && !isRootEditorEmpty;

  const confirmButtonId = useId();

  useKeyboardShortcut(
    [
      SHORTCUTS.OPEN_EDIT_TRANSLATION,
      SHORTCUTS.SAVE_EDIT_TRANSLATION,
      SHORTCUTS.CANCEL_EDIT_TRANSLATION,
    ],
    (e, matchedKeys) => {
      if (!data) return;
      if (isEqual(matchedKeys, SHORTCUTS.OPEN_EDIT_TRANSLATION)) {
        handleStartEdit();
        return;
      }
      if (isEqual(matchedKeys, SHORTCUTS.SAVE_EDIT_TRANSLATION) && isEditing) {
        handleConfirm();
        return;
      }
      handleCancel();
    },
    true,
  );

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
                  EN - {t('CONVERSATION.TRANSLATE_TOOL')}
                </span>
                {isFetching && <Spinner className="h-4 w-4 text-primary" />}
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
                      <EditorContent
                        className="max-h-[200px] min-h-[46] w-full overflow-y-auto"
                        editor={editor}
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
                        {t('COMMON.CANCEL')}
                      </Button>
                      <Button
                        id={confirmButtonId}
                        shape="square"
                        size="xs"
                        type="button"
                        onClick={handleConfirm}
                        variant="default"
                        color="primary"
                      >
                        {t('COMMON.SAVE_CHANGE')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="max-h-[200px] flex-1 overflow-y-auto">
                      {data && !isLoading ? (
                        <RichTextView mentionClassName="left" content={data} />
                      ) : (
                        <p className="italic text-neutral-300">
                          {t('CONVERSATION.STOP_TYPE')}
                        </p>
                      )}
                    </div>
                    <Button.Icon
                      disabled={isFetching || isRootEditorEmpty}
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
