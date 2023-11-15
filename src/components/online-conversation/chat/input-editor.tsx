'use client';

import {
  Edit2Outline,
  MicOutline,
  PaperPlaneOutline,
} from '@easy-eva-icons/react';

import { CircleFlag } from 'react-circle-flags';
import { IconButton } from '@/components/button';
import { Message } from '@/types/room';
import { getCountryCode } from '@/utils/language-fn';
import { sendMessage } from '@/services/conversation';
import { useChat } from './chat-context';
import { useState } from 'react';
import { useTextAreaResize } from '@/hooks/use-text-area-resize';

export interface InputEditorProps {}

export const InputEditor = (props: InputEditorProps) => {
  const [text, setText] = useState('');
  const { textAreaRef } = useTextAreaResize(text, 24);
  const [isFocused, setIsFocused] = useState(false);
  const { user, room } = useChat();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    const newMessage: Message = {
      sender: user,
      content: text,
      translatedContent: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSystem: false,
    };

    const data = await sendMessage(newMessage, room.code);
    console.log(data);
    setText('');
  };

  const targetLanguage = room.languages.find(
    (language) => language !== user.language,
  );

  return (
    <div className="chatInputWrapper">
      <div className="chatInput translated">
        <div className="inputMess">
          <CircleFlag
            className="inline-block"
            countryCode={getCountryCode(targetLanguage) || 'gb'}
            height={20}
            width={20}
          />
          어떻게 지내세요
        </div>
      </div>
      <div className="chatInput middle">
        <div className="inputMess">
          <CircleFlag
            className="inline-block"
            countryCode={'gb'}
            height={20}
            width={20}
          />
          How are you
        </div>
        <div className="inputChatButtonWrapper">
          <IconButton variant="ghost">
            <Edit2Outline className="opacity-60" />
          </IconButton>
        </div>
      </div>
      <div className="chatInput ">
        <div className="inputMess ">
          <CircleFlag
            className="inline-block"
            countryCode={getCountryCode(user.language) || 'gb'}
            height={20}
            width={20}
          />
          <textarea
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            ref={textAreaRef}
            className="w-full resize-none appearance-none border-none bg-transparent !text-base focus:border-transparent focus:outline-none focus:ring-0"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="inputChatButtonWrapper h-full items-end">
          {!text && (
            <IconButton variant="ghost" className="self-end">
              <MicOutline className="opacity-60" />
            </IconButton>
          )}
          <IconButton
            onClick={handleSendMessage}
            variant="ghostPrimary"
            className="self-end"
          >
            <PaperPlaneOutline />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
