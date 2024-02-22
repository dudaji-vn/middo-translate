import { Typography } from '@/components/data-display';
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
                className="min-h-10 mx-1 my-1 inline-block cursor-default rounded-md bg-gray-100 px-4 py-2 text-base font-semibold capitalize text-gray-700 shadow-md dark:bg-gray-800 dark:text-gray-300"
              >
                {key}
              </span>
            ))}
          </div>
        </div>
        <Typography className="text-gray-500">
          {item.description}
        </Typography>
      </div>
    ))}
  </div>
);

const translationShortcuts = generateShortcuts(SCTranslation);
const conversationShortcuts = generateShortcuts(SCConversation);
const callShortcuts = generateShortcuts(SCCall);

export default function Shortcuts() {
  return (
    <section className="container my-10 max-w-screen-md space-y-3 divide-y [&_h3]:mt-4 [&_h3]:text-[1.25rem]">
      <Typography variant="h1" className="text-md font-bold">
        Shortcut Information
      </Typography>

      <ShortcutSection
        title="Miido Translation"
        shortcuts={translationShortcuts}
      />
      <ShortcutSection
        title="Miido Conversation"
        shortcuts={conversationShortcuts}
      />
      <ShortcutSection title="Miido Call" shortcuts={callShortcuts} />
    </section>
  );
}
