import { Button } from '@/components/actions';
import { Switch } from '@/components/data-entry';
import { Spinner } from '@/components/feedback';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { MentionSuggestion } from '@/features/chat/messages/components/message-editor/mention-suggestion-options';
import { RichTextView } from '@/features/chat/messages/components/message-editor/rich-text-view';
import { useChatStore } from '@/features/chat/stores';
import { useMSEditorStore } from '@/features/chat/stores/editor-language.store';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { translateText } from '@/services/languages.service';
import { SHORTCUTS } from '@/types/shortcuts';
import { useQuery } from '@tanstack/react-query';
import { Editor, EditorContent } from '@tiptap/react';
import { AnimatePresence, motion } from 'framer-motion';
import { convert } from 'html-to-text';
import { isEqual } from 'lodash';
import { PenIcon } from 'lucide-react';
import {
  forwardRef,
  useId,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { CircleFlag } from 'react-circle-flags';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { useDebounceValue } from 'usehooks-ts';
import { Checkbox } from '../../../../../components/form/checkbox';
import { useEditor } from './use-editor';
const DEBOUNCE_TIME = 500;
export interface TranslationHelperProps {
  mentionSuggestionOptions: MentionSuggestion[];
  editor: Editor | null;
  onStartedEdit?: () => void;
  onFinishedEdit?: () => void;
  onSend?: () => void;
}

export type TranslationHelperRef = {
  getEnContent: () => string | null;
  clearContent: () => void;
  getSourceLang: () => string | null;
};

export const TranslationHelper = forwardRef<
  TranslationHelperRef,
  TranslationHelperProps
>(
  (
    {
      mentionSuggestionOptions,
      editor: rootEditor,
      onStartedEdit,
      onFinishedEdit,
      onSend,
    },
    ref,
  ) => {
    const {
      showTranslateOnType,
      toggleShowTranslateOnType,
      sendOnSave,
      toggleSendOnSave,
    } = useChatStore();
    const [isEditing, setIsEditing] = useState(false);
    const [enContent, setEnContent] = useState<string | null>(null);
    const [translatedEnContent, setTranslatedEnContent] = useState<
      string | null
    >(null);
    const { t } = useTranslation('common');
    const { detectedLanguage, languageCode } = useMSEditorStore(
      (state) => state,
    );

    const srcLang = useMemo(() => {
      return languageCode === 'auto' ? detectedLanguage : languageCode;
    }, [detectedLanguage, languageCode]);

    const handleEnter = () => {
      const confirmButton = document.getElementById(confirmButtonId);
      confirmButton?.click();
    };
    const editor = useEditor({
      mentionSuggestions: mentionSuggestionOptions,
      enterToSubmit: !isMobile,
      onEnterTrigger: handleEnter,
    });

    const [htmlDebounce] = useDebounceValue(
      rootEditor?.getHTML(),
      DEBOUNCE_TIME,
    );

    const isRootEditorEmpty = convert(htmlDebounce || '').trim() === '';

    const [translatedEnContentDebounce] = useDebounceValue(
      translatedEnContent,
      DEBOUNCE_TIME,
    );
    const { isLoading, isFetching, data } = useQuery({
      queryKey: ['translation-helper', htmlDebounce, srcLang],
      queryFn: async () => {
        const translated = await translateText(
          htmlDebounce || '',
          srcLang!,
          DEFAULT_LANGUAGES_CODE.EN,
        );
        return translated;
      },
      enabled:
        !isRootEditorEmpty &&
        htmlDebounce !== translatedEnContentDebounce &&
        !!srcLang,
      staleTime: Infinity,
      keepPreviousData: !isRootEditorEmpty,
    });
    const handleStartEdit = () => {
      editor?.commands.setContent(enContentToUse);
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
      setEnContent(content);
      const translated = await translateText(
        content,
        DEFAULT_LANGUAGES_CODE.EN,
        srcLang!,
      );
      onFinishedEdit?.();
      rootEditor?.commands.setContent(translated);
      setTranslatedEnContent(translated);
      if (sendOnSave) {
        onSend?.();
      }
    };

    const showHelper =
      rootEditor &&
      (!isRootEditorEmpty || rootEditor.getText().trim().length !== 0) &&
      showTranslateOnType;

    const confirmButtonId = useId();

    useKeyboardShortcut(
      [
        SHORTCUTS.OPEN_EDIT_TRANSLATION,
        SHORTCUTS.SAVE_EDIT_TRANSLATION,
        SHORTCUTS.CANCEL_EDIT_TRANSLATION,
      ],
      (e, matchedKeys) => {
        if (!showHelper) return;
        if (isEqual(matchedKeys, SHORTCUTS.OPEN_EDIT_TRANSLATION)) {
          handleStartEdit();
          return;
        }
        if (
          isEqual(matchedKeys, SHORTCUTS.SAVE_EDIT_TRANSLATION) &&
          isEditing
        ) {
          handleConfirm();
          return;
        }

        handleCancel();
      },
      true,
    );

    const clearContent = () => {
      setEnContent(null);
      setTranslatedEnContent(null);
    };

    const enContentToUse =
      translatedEnContentDebounce === htmlDebounce ? enContent : data;

    useImperativeHandle(
      ref,
      () => ({
        getEnContent: () => {
          return enContentToUse;
        },
        clearContent,
        getSourceLang: () => {
          return srcLang;
        },
      }),
      [enContentToUse, srcLang],
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
              <div className="rounded-xl bg-primary-100 dark:bg-neutral-900">
                <div className="flex items-center gap-3 p-3">
                  <CircleFlag countryCode="gb" height="20" width="20" />
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-200">
                    {t('CONVERSATION.TRANSLATED_TOOL')}
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
                      <div>
                        <div
                          className={
                            'mb-2 flex flex-1 rounded-xl border border-primary-500-main bg-white px-3 py-2 dark:bg-neutral-900'
                          }
                        >
                          <EditorContent
                            className="max-h-[200px] min-h-[46] w-full overflow-y-auto"
                            editor={editor}
                          />
                        </div>
                        <Checkbox
                          checked={sendOnSave}
                          onCheckedChange={toggleSendOnSave}
                          label="Send on save changes"
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
                          <RichTextView
                            mentionClassName="left"
                            content={enContentToUse}
                          />
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
  },
);

TranslationHelper.displayName = 'TranslationHelper';
