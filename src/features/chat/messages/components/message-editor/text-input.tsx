import { AnimatePresence, motion } from 'framer-motion';
import { Pen, Settings } from 'lucide-react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { Button } from '@/components/actions';
import { CircleFlag } from 'react-circle-flags';
import { Switch } from '@/components/data-entry';
import { Triangle } from '@/components/icons';
import { useChatStore } from '@/features/chat/store';
import { useTranslate } from '@/features/translate/hooks/use-translate';

export interface TextInputRef extends HTMLInputElement {
  reset: () => void;
}
export const TextInput = forwardRef<
  TextInputRef,
  React.HTMLProps<HTMLInputElement>
>((props, ref) => {
  const { text, setText, translatedText } = useTranslate({
    sourceLanguage: 'vi',
    targetLanguage: 'en',
  });

  const { showTranslateOnType, toggleShowTranslateOnType } = useChatStore();
  const [showNotification, setShowNotification] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(
    ref,
    () => ({
      ...(inputRef.current as HTMLInputElement),
      reset: () => {
        setText('');
      },
    }),
    [],
  );
  return (
    <>
      <input
        ref={inputRef}
        {...props}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 bg-transparent outline-none"
        autoComplete="off"
        name="message"
        type="text"
        placeholder="Type a message"
      />
      <div className="absolute -top-4 left-0 w-full -translate-y-full outline-none">
        <AnimatePresence mode="wait">
          {showTranslateOnType && translatedText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: 'backOut' }}
              className=""
            >
              <div className="rounded-xl bg-colors-neutral-white shadow-2 ">
                <div className="flex items-center gap-3 p-3">
                  <CircleFlag countryCode="gb" height="20" width="20" />
                  <span className="text-sm font-medium text-colors-neutral-600">
                    EN - Translate tool
                  </span>
                  <Switch
                    checked={showTranslateOnType}
                    onCheckedChange={(checked) => {
                      toggleShowTranslateOnType();
                      if (!checked) {
                        setShowNotification(true);
                        setTimeout(() => {
                          setShowNotification(false);
                        }, 5000);
                      }
                    }}
                    className="ml-auto"
                  />
                </div>
                <div className="flex pb-3 pl-3 pr-1 pt-1 ">
                  <div className="flex-1">
                    <p className="text-colors-neutral-600">{translatedText}</p>
                  </div>
                  <Button.Icon variant="ghost" color="default">
                    <Pen />
                  </Button.Icon>
                </div>
              </div>
              <div className="pl-[60px]">
                <Triangle fill="white" position="bottom" />
              </div>
            </motion.div>
          )}
          {showNotification && !showTranslateOnType && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
              transition={{ duration: 0.2, ease: 'backOut' }}
              className=""
            >
              <NotificationTranslation
                onClose={() => setShowNotification(false)}
              />
              <div className="pl-[60px]">
                <Triangle fill="white" position="bottom" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
});

TextInput.displayName = 'TextInput';

const NotificationTranslation = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div className="flex items-center justify-between rounded-xl bg-colors-neutral-white p-3 shadow-2">
      <p>
        EN - Translate tool is turn off, you can turn it on again in{' '}
        <span className="font-medium text-colors-primary-500-main">
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
