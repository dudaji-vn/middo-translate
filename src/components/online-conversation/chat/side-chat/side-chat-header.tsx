'use client';

import { ChatDownloadIcon } from '@/components/icons';
import { CopyOutline } from '@easy-eva-icons/react';
import { IconButton } from '@/components/button';
import { Room } from '@/types/room';
import { Section } from './section';
import { genChatLogFile } from '@/utils/gen-chat-log-file';
import { useBoxChat } from '../box-chat-context';
import { useTextCopy } from '@/hooks/use-text-copy';

export interface SideChatHeaderProps {
  code: string;
  room: Room;
}

export const SideChatHeader = ({ room }: SideChatHeaderProps) => {
  const { copy } = useTextCopy(room.code);
  const { messages } = useBoxChat();
  const handleDownload = () => {
    const content = genChatLogFile({ room, messages });
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${room.code}.txt`;
    a.click();
  };
  return (
    <div className="bg-background">
      <Section title="Code: ">
        <div className="flex items-center justify-between py-3">
          <h4 className="text-primary">{room.code}</h4>
          <div className="flex">
            <IconButton variant="ghost">
              <CopyOutline className="opacity-60" onClick={() => copy()} />
            </IconButton>
            <IconButton onClick={handleDownload} variant="ghost">
              <ChatDownloadIcon className="opacity-60" />
            </IconButton>
          </div>
        </div>
      </Section>
    </div>
  );
};
