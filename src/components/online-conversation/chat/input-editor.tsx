'use client';

import {
  CheckmarkCircle2,
  CloseCircle,
  Edit2Outline,
  MicOutline,
  PaperPlaneOutline,
} from '@easy-eva-icons/react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/actions';
import { CircleFlag } from 'react-circle-flags';
import { DEFAULT_LANGUAGES_CODE } from '@/configs/default-language';
import { Participant } from '@/types/room';
import { SOCKET_CONFIG } from '@/configs/socket';
import { SendMessagePayload } from '@/types/socket';
import { SvgSpinners270RingWithBg } from '@/components/icons';
import { Text } from '@/components/text';
import { cn } from '@/utils/cn';
import { getCountryCode } from '@/utils/language-fn';
import socket from '@/lib/socket-io';
import { useChat } from './chat-context';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useTextAreaResize } from '@/hooks/use-text-area-resize';
import { useTranslate } from '@/hooks/use-translate';

export interface InputEditorProps {}

export const InputEditor = (props: InputEditorProps) => {
  const { room, user, setIsTranslatePopupOpen, isQuickSend } = useChat();
  const isMobile = useIsMobile();
  const sourceLanguage = user.language;
  const targetLanguage = room.languages.find(
    (language) => language !== user.language,
  );

  const {
    reset,
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
    translate,
  } = useTranslate({
    sourceLanguage,
    targetLanguage: targetLanguage || 'en',
    listenMode: 'continuous',
    translateOnType: !isQuickSend,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeoutId, setTypingTimeoutId] = useState<NodeJS.Timeout>();
  const [isFocused, setIsFocused] = useState(false);
  const { textAreaRef } = useTextAreaResize(text, 24);
  const { textAreaRef: middleTextAreaRef } = useTextAreaResize(
    middleText,
    24,
    isEditing,
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) return;
    if (e.key === 'Enter' && !isMobile) {
      e.preventDefault();
      handleSendMessage();
      setIsTyping(false);
    }
  };

  const isSendAble = useMemo(() => {
    if (!text) return false;
    if (isLoading) return false;
    if (isQuickSend) return true;
    if (isTyping) return false;
    if (targetLanguage === DEFAULT_LANGUAGES_CODE.EN && !englishText)
      return false;
    if (sourceLanguage === DEFAULT_LANGUAGES_CODE.EN && !translatedText)
      return false;
    if (
      sourceLanguage !== DEFAULT_LANGUAGES_CODE.EN &&
      targetLanguage !== DEFAULT_LANGUAGES_CODE.EN &&
      !translatedText
    ) {
      return false;
    }
    return true;
  }, [
    isQuickSend,
    text,
    isTyping,
    isLoading,
    targetLanguage,
    englishText,
    sourceLanguage,
    translatedText,
  ]);

  const handleSendMessage = async () => {
    if (!isSendAble) return;

    if (isQuickSend) {
      const { englishText, originalText, translatedText } =
        await translate(text);
      const newMessage = createMessage({
        user,
        text: originalText,
        targetLanguage: targetLanguage || 'en',
        englishText,
        translatedText,
      });
      const sendMessagePayload: SendMessagePayload = {
        roomCode: room.code,
        message: newMessage,
      };
      socket.emit(SOCKET_CONFIG.EVENTS.MESSAGE.NEW, sendMessagePayload);
      handleStopListening();
      reset();
      return;
    }
    if (englishText || translatedText) {
      const newMessage = createMessage({
        user,
        text,
        targetLanguage: targetLanguage || 'en',
        englishText,
        translatedText,
      });

      const sendMessagePayload: SendMessagePayload = {
        roomCode: room.code,
        message: newMessage,
      };

      socket.emit(SOCKET_CONFIG.EVENTS.MESSAGE.NEW, sendMessagePayload);

      handleStopListening();
      reset();
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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setMiddleText('');
    if (!isTyping) {
      setIsTyping(true);
    }

    if (typingTimeoutId) {
      clearTimeout(typingTimeoutId);
    }

    setTypingTimeoutId(
      setTimeout(() => {
        setIsTyping(false);
      }, 1000),
    );
  };

  useEffect(() => {
    setIsTranslatePopupOpen(isSendAble);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSendAble]);

  useEffect(() => {
    if (textAreaRef.current)
      textAreaRef.current.scrollTo({
        top: textAreaRef.current.scrollHeight,
        behavior: 'instant',
      });
  }, [textAreaRef, text]);

  return (
    <div className="chatInputWrapper">
      {!isQuickSend && (
        <>
          {translatedText && (
            <div className="chatInput middle">
              <div className="inputMess">
                <CircleFlag
                  className="inline-block"
                  countryCode={getCountryCode(targetLanguage) || 'gb'}
                  height={20}
                  width={20}
                />
                <div className="break-word-mt max-h-[48px] overflow-y-auto md:max-h-[96px]">
                  <Text value={translatedText} />
                </div>
              </div>
              <Button.Icon
                disabled
                variant="ghost"
                className="self-end opacity-0"
                color="default"
              >
                <Edit2Outline />
              </Button.Icon>
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
                  className="max-h-[48px] w-full resize-none  appearance-none border-none bg-transparent !text-base focus:border-transparent focus:outline-none focus:ring-0 md:max-h-[96px]"
                  value={middleText}
                  onChange={(e) => setMiddleText(e.target.value)}
                />
              </div>
              <div className="inputChatButtonWrapper h-full !flex-col !justify-between">
                <Button.Icon
                  onClick={handleCancelEdit}
                  variant="ghost"
                  className="self-end"
                  color="default"
                >
                  <CloseCircle />
                </Button.Icon>
                <Button.Icon
                  onClick={handleSubmitEdit}
                  color="success"
                  className="self-end"
                >
                  <CheckmarkCircle2 />
                </Button.Icon>
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

                    <div className="break-word-mt max-h-[48px] overflow-y-auto md:max-h-[96px]">
                      <Text value={englishText} />
                    </div>
                  </div>
                  <div className="inputChatButtonWrapper h-full !items-end">
                    <Button.Icon
                      onClick={handleEdit}
                      variant="ghost"
                      color="default"
                    >
                      <Edit2Outline />
                    </Button.Icon>
                  </div>
                </div>
              )}
            </>
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
            className="max-h-[48px] w-full resize-none appearance-none border-none bg-transparent !text-base focus:border-transparent focus:outline-none focus:ring-0 md:max-h-[96px]"
            value={text}
            onChange={handleTextChange}
          />
        </div>
        <div className="inputChatButtonWrapper h-full items-end">
          {(!text || listening) && (
            <Button.Icon
              onClick={listening ? handleStopListening : handleStartListening}
              variant="ghost"
              className="self-end"
              color="default"
            >
              <MicOutline
                className={cn(
                  'opacity-60',
                  listening && 'text-primary opacity-100',
                )}
              />
            </Button.Icon>
          )}
          {
            <Button.Icon
              disabled={!isSendAble}
              onClick={handleSendMessage}
              variant="ghost"
              color="primary"
              className="self-end"
            >
              {isLoading ? (
                <SvgSpinners270RingWithBg className="text-primary" />
              ) : (
                <PaperPlaneOutline />
              )}
            </Button.Icon>
          }
        </div>
      </div>
    </div>
  );
};

const createMessage = ({
  user,
  text,
  targetLanguage,
  englishText,
  translatedText,
}: {
  user: Participant;
  text: string;
  targetLanguage: string;
  englishText: string;
  translatedText: string;
}) => {
  return {
    sender: user,
    content: text,
    translatedContent:
      targetLanguage === DEFAULT_LANGUAGES_CODE.EN
        ? englishText
        : translatedText,
    englishContent: englishText || text,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isSystem: false,
  };
};
