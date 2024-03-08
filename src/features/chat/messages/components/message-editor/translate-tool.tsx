import { AnimatePresence, motion } from 'framer-motion';
import { Pen, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/actions';
import { CircleFlag } from 'react-circle-flags';
import { Spinner } from '@/components/feedback';
import { Switch } from '@/components/data-entry';
import { cn } from '@/utils/cn';
import { useTextAreaResize } from '@/hooks/use-text-area-resize';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import isEqual from 'lodash/isEqual';
import { useMessageEditorText } from './message-editor-text-context';

const TIMEOUT = 5000;
export interface TranslateToolProps {
  showTool: boolean;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  content: string;
  isEditing?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onEdit?: () => void;
  middleText: string;
  setMiddleText?: (text: string) => void;
  onEditStateChange?: (isEditing: boolean) => void;
  loading?: boolean;
}

export const TranslateTool = ({
  showTool,
  checked,
  onCheckedChange,
  content,
  onCancel,
  onConfirm,
  middleText,
  setMiddleText,
  onEditStateChange,
  onEdit,
  loading,
}: TranslateToolProps) => {
  const [showNotification, setShowNotification] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { textAreaRef: middleTextAreaRef } = useTextAreaResize(
    middleText,
    10,
    isEditing,
  );
  const { text } = useMessageEditorText();
  const closeEdit = () => setIsEditing(false);
  const handleCancel = () => {
    closeEdit();
    onCancel?.();
    onEditStateChange?.(false);
  };
  const handleStartEdit = () => {
    setIsEditing(true);
    onEditStateChange?.(true);
    onEdit?.();
    setTimeout(() => {
      // focus to text area end cursor
      middleTextAreaRef?.current?.focus();
      middleTextAreaRef?.current?.setSelectionRange(
        middleTextAreaRef?.current?.value.length ?? 0,
        middleTextAreaRef?.current?.value.length ?? 0,
      );
    }, 100);
  };

  const handleConfirm = () => {
    closeEdit();
    onConfirm?.();
  };
  useKeyboardShortcut(
    [
      SHORTCUTS.OPEN_EDIT_TRANSLATION,
      SHORTCUTS.SAVE_EDIT_TRANSLATION,
      SHORTCUTS.CANCEL_EDIT_TRANSLATION,
    ],
    (e, matchedKeys) => {
      if (!text?.length) return;
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
  useEffect(() => {
    if (!checked) {
      setIsEditing(false);
    }
  }, [checked]);
  return (
    <AnimatePresence mode="wait">
      {showTool && (
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
                {loading && <Spinner className="h-4 w-4 text-primary" />}

                <Switch
                  checked={checked}
                  onCheckedChange={(checked) => {
                    onCheckedChange(checked);
                    if (!checked) {
                      setShowNotification(true);
                      setTimeout(() => {
                        setShowNotification(false);
                      }, TIMEOUT);
                    }
                  }}
                  className="ml-auto"
                />
              </div>
              <div className="flex px-3 pb-3 pt-1">
                <div
                  className={cn('flex flex-1 flex-col', !isEditing && 'hidden')}
                >
                  <div
                    className={
                      'flex flex-1 rounded-xl border border-primary-500-main bg-white p-3'
                    }
                  >
                    <textarea
                      ref={middleTextAreaRef}
                      className={cn(
                        'max-h-[160px] flex-1 resize-none outline-none',
                      )}
                      value={middleText}
                      onChange={(e) => setMiddleText?.(e.target.value)}
                      name="messageEnglish"
                      placeholder="Type a message"
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
                {!isEditing && (
                  <div className="flex-1">
                    {content ? (
                      <p className="text-neutral-600">{content}</p>
                    ) : (
                      <p className="italic text-neutral-300">
                        Stop typing to see translation...
                      </p>
                    )}
                  </div>
                )}

                {!isEditing && (
                  <Button.Icon
                    disabled={loading || !content}
                    type="button"
                    onClick={handleStartEdit}
                    variant="ghost"
                    color="default"
                    size="xs"
                  >
                    <Pen />
                  </Button.Icon>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {showNotification && !checked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
          transition={{ duration: 0.2, ease: 'backOut' }}
          className=""
        >
          <NotificationTranslation onClose={() => setShowNotification(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const NotificationTranslation = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div className="flex items-center justify-between rounded-xl bg-neutral-white p-3 shadow-2">
      <p>
        EN - Translate tool is turn off, you can turn it on again in
        <span className="font-medium text-primary-500-main">
          Chat setting
          <Settings className="ml-1 inline-block" />
        </span>
      </p>
      <Button
        onClick={onClose}
        shape="square"
        size="md"
        variant="ghost"
        color="default"
      >
        Close
      </Button>
    </div>
  );
};
