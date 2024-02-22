'use client';


import { Typography } from '@/components/data-display';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import {
  SCCall,
  SCConversation,
  SCTranslation,
  SHORTCUTS,
  SHORTCUT_CONTENTS,
  SPECIAL_KEYS_CONTENT,
  ShortcutInfo,
} from '@/types/shortcuts';
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
      shortcut: SPECIAL_KEYS_CONTENT[shortcut] || SHORTCUTS[shortcut],
    }),
  );

const ShortcutSection: React.FC<ShortcutSectionProps> = ({
  title,
  shortcuts,
}) => (
  <div className="flex flex-col py-2">
    <Typography variant="h2" className="text-2xl">
      {title}
    </Typography>
    {shortcuts.map((item, index) => (
      <div key={index}>
        <div className="flex flex-row items-end justify-between">
          <Typography variant={'h3'} className="font-normal">
            {item.title}
          </Typography>
          <div className="my-1 flex w-fit flex-row">
            {item.shortcut?.map((key) => (
              <span
                key={key}
                className="mx-1 my-1 inline-block min-h-10 cursor-default rounded-md bg-gray-100 px-4 py-2 text-base font-semibold capitalize text-gray-700 shadow-md dark:bg-gray-800 dark:text-gray-300"
              >
                {key}
              </span>
            ))}
          </div>
        </div>
        <Typography className="text-gray-500">{item.description}</Typography>
      </div>
    ))}
  </div>
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
  useKeyboardShortcut([['?']], () => setOpen((prev)=> !prev));
  if (!isClient) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent className="max-h-[90vh] max-w-screen-md  overflow-y-scroll">        <DialogTitle>
          <Typography variant="h1" className="text-md font-bold text-center">
            Shortcut
          </Typography>
        </DialogTitle>
        <div className=" max-w-screen-md space-y-3 divide-y [&_h3]:mt-4 [&_h3]:text-[1.25rem] ">
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
  );
}
