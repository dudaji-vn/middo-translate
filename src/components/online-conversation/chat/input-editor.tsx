'use client';

import {
  CheckmarkCircle2,
  CloseCircle,
  Edit2Outline,
  MicOutline,
  PaperPlaneOutline,
} from '@easy-eva-icons/react';

import { CircleFlag } from 'react-circle-flags';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { IconButton } from '@/components/button';
import { Message } from '@/types/room';
import { SvgSpinners270RingWithBg } from '@/components/icons';
import { cn } from '@/utils/cn';
import { getCountryCode } from '@/utils/language-fn';
import { sendMessage } from '@/services/conversation';
import { useChat } from './chat-context';
import { useState } from 'react';
import { useTextAreaResize } from '@/hooks/use-text-area-resize';
import { useTranslate } from '@/hooks/use-translate';

export interface InputEditorProps {}

export const InputEditor = (props: InputEditorProps) => {
  const { room, user } = useChat();
  const sourceLanguage = user.language;
  const targetLanguage = room.languages.find(
    (language) => language !== user.language,
  );

  const {
    text,
    setText,
    translatedText,
    englishText,
    middleText,
    setMiddleText,
    handleMiddleTranslate,
    handleStartListening,
    handleStopListening,
    listening,
    isLoading,
  } = useTranslate({
    sourceLanguage,
    targetLanguage: targetLanguage || 'en',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { textAreaRef } = useTextAreaResize(text, 24);
  const { textAreaRef: middleTextAreaRef } = useTextAreaResize(
    middleText,
    24,
    isEditing,
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (englishText || translatedText) {
      const newMessage: Message = {
        sender: user,
        content: text,
        translatedContent:
          targetLanguage === DEFAULT_LANGUAGES_CODE.EN
            ? englishText
            : translatedText,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSystem: false,
      };

      await sendMessage(newMessage, room.code);
      setMiddleText('');
      setText('');
    }
  };

  const handleSubmitEdit = () => {
    handleMiddleTranslate();
    setIsEditing(false);
  };

  const handleEdit = () => {
    setMiddleText(englishText);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setMiddleText('');
  };

  return (
    <div className="chatInputWrapper">
      {translatedText && (
        <div className="chatInput middle">
          <div className="inputMess">
            <CircleFlag
              className="inline-block"
              countryCode={getCountryCode(targetLanguage) || 'gb'}
              height={20}
              width={20}
            />
            <div className="break-word-mt max-h-[96px] overflow-y-auto">
              {translatedText}
            </div>
          </div>
          <IconButton disabled variant="ghost" className="self-end opacity-0">
            <Edit2Outline className="opacity-60" />
          </IconButton>
        </div>
      )}
      {isEditing ? (
        <div className="chatInput !items-start">
          <div className="inputMess ">
            <CircleFlag
              className="inline-block"
              countryCode={'gb'}
              height={20}
              width={20}
            />
            <textarea
              ref={middleTextAreaRef}
              className="max-h-[96px] w-full  resize-none appearance-none border-none bg-transparent !text-base focus:border-transparent focus:outline-none focus:ring-0"
              value={middleText}
              onChange={(e) => setMiddleText(e.target.value)}
            />
          </div>
          <div className="inputChatButtonWrapper h-full !flex-col !justify-between">
            <IconButton
              onClick={handleCancelEdit}
              variant="ghost"
              className="self-end"
            >
              <CloseCircle className="opacity-60" />
            </IconButton>
            <IconButton
              onClick={handleSubmitEdit}
              variant="success"
              className="self-end"
            >
              <CheckmarkCircle2 />
            </IconButton>
          </div>
        </div>
      ) : (
        <>
          {englishText && (
            <div className="chatInput middle">
              <div className="inputMess">
                <CircleFlag
                  className="inline-block"
                  countryCode={'gb'}
                  height={20}
                  width={20}
                />

                <div className="break-word-mt max-h-[96px] overflow-y-auto">
                  {englishText}
                </div>
              </div>
              <div className="inputChatButtonWrapper h-full !items-end">
                <IconButton onClick={handleEdit} variant="ghost">
                  <Edit2Outline className="opacity-60" />
                </IconButton>
              </div>
            </div>
          )}
        </>
      )}
      <div className={`chatInput ${isEditing && ' middle'}`}>
        <div className="inputMess ">
          <CircleFlag
            className="inline-block"
            countryCode={getCountryCode(user.language) || 'gb'}
            height={20}
            width={20}
          />
          <textarea
            placeholder={listening ? 'Listening...' : 'Type a message...'}
            disabled={isEditing}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            ref={textAreaRef}
            className="max-h-[96px] w-full resize-none appearance-none border-none bg-transparent !text-base focus:border-transparent focus:outline-none focus:ring-0"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setMiddleText('');
            }}
          />
        </div>
        <div className="inputChatButtonWrapper h-full items-end">
          {(!text || listening) && (
            <IconButton
              onClick={listening ? handleStopListening : handleStartListening}
              variant="ghost"
              className="self-end"
            >
              <MicOutline
                className={cn('opacity-60', listening && 'text-primary')}
              />
            </IconButton>
          )}
          <IconButton
            disabled={!text}
            onClick={handleSendMessage}
            variant="ghostPrimary"
            className="self-end"
          >
            {isLoading ? (
              <SvgSpinners270RingWithBg className="text-primary" />
            ) : (
              <PaperPlaneOutline />
            )}
          </IconButton>
        </div>
      </div>
    </div>
  );
};
