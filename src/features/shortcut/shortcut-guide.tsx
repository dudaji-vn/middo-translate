'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import {
  SCCall,
  SCConversation,
  SCTranslation,
  SHORTCUTS,
  SHORTCUT_CONTENTS,
  MAPPED_SPECIAL_KEYS,
  ShortcutInfo,
} from '@/types/shortcuts';
import { HelpCircle, Info } from 'lucide-react';
import React from 'react';

type ShortcutSectionProps = {
  title: string;
  shortcuts: ShortcutInfo[];
};
const generateShortcuts = (
  shortcutType: typeof SCConversation | typeof SCTranslation | typeof SCCall,
) =>
  Object.values(shortcutType).map(
    (shortcut: SCConversation | SCTranslation | SCCall) => ({
      ...SHORTCUT_CONTENTS[shortcut],
      shortcut: SHORTCUTS[shortcut],
    }),
  );

const ShortcutSection: React.FC<ShortcutSectionProps> = ({
  title,
  shortcuts,
}) => (
  <section className="flex flex-col py-4">
    <Typography variant="h2" className="text-2xl">
      {title}
    </Typography>
    {shortcuts.map((item, index) => (
      <div key={index}>
        <div className="flex flex-row items-baseline justify-between">
          <Typography variant={'h3'} className="text-[1.2rem] font-normal">
            {item.title}
          </Typography>
          <div className="mt-1 flex w-fit flex-row">
            {item.shortcut?.map((key) => (
              <span
                key={key}
                className="mx-1 my-1 inline-block min-h-10 cursor-default rounded-md bg-gray-100 px-4 py-2 text-base font-semibold capitalize text-gray-700 shadow-md dark:bg-gray-800 dark:text-gray-300"
              >
                {MAPPED_SPECIAL_KEYS[key] || key}
              </span>
            ))}
          </div>
        </div>
        <Typography className="text-gray-500">{item.description}</Typography>
      </div>
    ))}
  </section>
);

const translationShortcuts = generateShortcuts(SCTranslation);
const conversationShortcuts = generateShortcuts(SCConversation);
const callShortcuts = generateShortcuts(SCCall);

export default function ShortcutsGuide() {
  const [isClient, setIsClient] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  useKeyboardShortcut([['?']], () => setOpen((prev) => !prev));
  if (!isClient) return null;
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-screen-md  overflow-y-scroll">
          <div className=" max-w-screen-md space-y-5 divide-y px-8 [&_h3]:mt-4 [&_h3]:text-[1.25rem]">
            <DialogTitle>
              <Typography
                variant="h4"
              >
                <Info className="absolute -left-8 top-1/2 -translate-y-1/2 transform" />
                Shortcut
              </Typography>
            </DialogTitle>
            <ShortcutSection
              title="Middo Translation"
              shortcuts={translationShortcuts}
            />
            <ShortcutSection
              title="Middo Conversation"
              shortcuts={conversationShortcuts}
            />
            <ShortcutSection title="Middo Call" shortcuts={callShortcuts} />
          </div>
        </DialogContent>
      </Dialog>
      {/* floating button */}
      <Button.Icon
        className="fixed bottom-4 left-4 z-50 p-2 rounded-full bg-white shadow-md dark:bg-gray-800 max-md:hidden"
        variant={'ghost'}
        size={'xs'}
        onClick={() => setOpen(true)}
      >
        <HelpCircle className="w-6 h-6" />
      </Button.Icon>
    </>
  );
}
