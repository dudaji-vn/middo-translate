import { AnimatePresence, motion } from 'framer-motion';
import { Pen, Settings } from 'lucide-react';

import { Button } from '@/components/actions';
import { CircleFlag } from 'react-circle-flags';
import { Switch } from '@/components/data-entry';
import { Triangle } from '@/components/icons';
import { useState } from 'react';

const TIMEOUT = 5000;
export interface TranslateToolProps {
  showTool: boolean;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  content: string;
}

export const TranslateTool = ({
  showTool,
  checked,
  onCheckedChange,
  content,
}: TranslateToolProps) => {
  const [showNotification, setShowNotification] = useState(false);
  return (
    <div className="absolute -top-4 left-0 w-full -translate-y-full outline-none">
      <AnimatePresence mode="wait">
        {showTool && (
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
              <div className="flex pb-3 pl-3 pr-1 pt-1 ">
                <div className="flex-1">
                  <p className="text-colors-neutral-600">{content}</p>
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
        {showNotification && !checked && (
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
  );
};

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
