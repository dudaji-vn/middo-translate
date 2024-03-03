'use client';

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/data-display/accordion';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import {
  MAPPED_MAC_KEYS,
  MAPPED_WIN_KEYS,
  SCCall,
  SCConversation,
  SCTranslation,
  SHORTCUTS,
  SHORTCUT_CONTENTS,
  transferSpecialKey,
} from '@/types/shortcuts';
import { cn } from '@/utils/cn';

import { HelpCircle, Info, Minus, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useVideoCallStore } from '../call/store/video-call.store';

type ShortcutSectionProps = {
  title: string;
  isMacOS: boolean;
  shortcuts: Array<{
    content: string;
    shortcut: string[];
  }>;
};
const generateShortcuts = (
  shortcutType: typeof SCConversation | typeof SCTranslation | typeof SCCall,
) =>
  Object.values(shortcutType).map(
    (shortcut: SCConversation | SCTranslation | SCCall) => ({
      content: SHORTCUT_CONTENTS[shortcut],
      shortcut: SHORTCUTS[shortcut],
    }),
  );

const ShortcutSection: React.FC<ShortcutSectionProps> = ({
  title,
  shortcuts,
  isMacOS,
}) => (
  <AccordionItem value={title}>
    <AccordionTrigger className="flex h-11 w-full flex-row items-center justify-between  rounded-none !bg-neutral-50 p-2 py-1 ">
      <Typography
        variant="h4"
        className="text-base leading-[18px] text-neutral-600 "
      >
        {title}
      </Typography>
    </AccordionTrigger>
    <AccordionContent className="accordion-up 0.2s py-0 ease-out">
      <div className="flex flex-col gap-0 divide-y divide-neutral-50">
        {shortcuts.map((item, index) => (
          <div
            key={index}
            className="my-0 flex h-[50px] w-full flex-row items-center justify-between  py-1 pl-2 pr-1 "
          >
            <Typography variant={'h5'} className="mt-0  text-base font-normal">
              {item.content}
            </Typography>
            <div className="my-1 mt-1 flex w-fit flex-row items-center gap-4">
              {item.shortcut?.map((key, index) => {
                const isLast = index === item.shortcut.length - 1;
                const osKey =
                  (isMacOS ? MAPPED_MAC_KEYS[key] : MAPPED_WIN_KEYS[key]) || key;
                const finalKey = transferSpecialKey(isMacOS)[osKey] || osKey;
                return (
                  <>
                    <span
                      key={key}
                      className={cn(
                        'mx-1 my-1 inline-block h-[34px] min-h-10 w-[82px] cursor-default rounded-xl bg-neutral-50 p-[8px_12px] text-center text-base font-semibold capitalize text-neutral-800 shadow-1 ',
                        isLast ? 'w-auto min-w-[40px]' : '',
                      )}
                    >
                      {finalKey}
                    </span>
                    {!isLast && '+'}
                  </>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </AccordionContent>
  </AccordionItem>
);

const translationShortcuts = generateShortcuts(SCTranslation);
const conversationShortcuts = generateShortcuts(SCConversation);
const callShortcuts = generateShortcuts(SCCall);

type AccordionValue = 'Middo Translation' | 'Middo Conversation' | 'Middo Call';
export default function ShortcutsGuide() {
  const [isClient, setIsClient] = React.useState(false);
  const pathname = usePathname();
  const { room } = useVideoCallStore();
  const defaultValue: AccordionValue = room
    ? 'Middo Call'
    : pathname === ROUTE_NAMES.ROOT
      ? 'Middo Translation'
      : 'Middo Conversation';

  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  const { isMacOS } = useKeyboardShortcut([['?']], () =>
    setOpen((prev) => !prev),
  );
  if (!isClient) return null;
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-fit  max-w-screen-md">
          <DialogTitle className="flex h-[48px] flex-row items-center justify-between py-4 pr-2">
            <Typography variant="h4">
              <Info className="absolute -left-8 top-1/2 -translate-y-1/2 transform" />
              Shortcut
            </Typography>
          </DialogTitle>
          <div className=" max-h-[calc(85vh-48px)] max-w-screen-md overflow-y-scroll bg-white [&_h3]:mt-4  [&_h3]:text-[1.25rem]">
            <Accordion
              type="single"
              collapsible
              className="w-full transition-all duration-500 "
              defaultValue={defaultValue}
            >
              <ShortcutSection
                isMacOS={isMacOS}
                title="Middo Translation"
                shortcuts={translationShortcuts}
              />
              <ShortcutSection
                isMacOS={isMacOS}
                title="Middo Conversation"
                shortcuts={conversationShortcuts}
              />
              <ShortcutSection
                isMacOS={isMacOS}
                title="Middo Call"
                shortcuts={callShortcuts}
              />
            </Accordion>
          </div>
        </DialogContent>
      </Dialog>
      {/* floating button */}
      <Button.Icon
        className="fixed bottom-4 left-4 z-50 rounded-full bg-white p-2 shadow-md max-md:hidden dark:bg-gray-800"
        variant={'ghost'}
        size={'xs'}
        onClick={() => setOpen(true)}
      >
        <HelpCircle className="h-6 w-6" />
      </Button.Icon>
    </>
  );
}
