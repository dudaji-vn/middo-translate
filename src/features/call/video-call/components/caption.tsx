import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScanText, XIcon } from 'lucide-react';
import { Avatar, Text } from '@/components/data-display';
import { Button } from '@/components/actions';
import { TriangleSmall } from '@/components/icons/triangle-small';
import { useAuthStore } from '@/stores/auth.store';
import { translateText } from '@/services/languages.service';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useVideoCallStore } from '../../store/video-call.store';
import CaptionInterface from '../../interfaces/caption.interface';
import { useTranslation } from 'react-i18next';
import useSpeechToTextCaption from '../../hooks/use-speech-to-text-caption';
import { SUPPORTED_VOICE_MAP } from '@/configs/default-language';

export default function CaptionSection() {
  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  const isShowCaption = useVideoCallStore(state => state.isShowCaption);
  if (!isFullScreen || !isShowCaption) return null;
  return <CaptionContent />;
}


const CaptionContent = () => {
  const {t} = useTranslation('common')
  const setShowCaption = useVideoCallStore(state => state.setShowCaption);
  const captions = useVideoCallStore(state => state.captions);
  const addCaption = useVideoCallStore(state => state.addCaption);
  const clearCaption = useVideoCallStore(state => state.clearCaption);
  const user = useAuthStore(state => state.user);

  const captionListRef = useRef<HTMLDivElement>(null);
  const { transcript } = useSpeechToTextCaption(SUPPORTED_VOICE_MAP[(user?.language || 'auto') as keyof typeof SUPPORTED_VOICE_MAP]);
  const [isScroll, setScroll] = useState(false);
  
  const scrollToBottom = useCallback(
    (isForceScroll = false) => {
      if (isScroll && !isForceScroll) return;
      setTimeout(() => {
        captionListRef.current?.scrollTo({
          top: captionListRef.current.scrollHeight + 200,
          behavior: 'smooth',
        });
      }, 500);
    },
    [isScroll],
  );

  useEffect(() => {
    if (!transcript) return;
    const myLanguage = user?.language || 'en';
    const translateCaption = async () => {
      let contentEn = transcript;
      if (myLanguage !== 'en') {
        contentEn = await translateText(transcript, myLanguage, 'en');
      }
      const captionObj = {
        user,
        content: transcript,
        contentEn: contentEn,
        language: myLanguage,
      };
      addCaption({
        ...captionObj,
        isMe: true,
      });
      scrollToBottom();
      socket.emit(SOCKET_CONFIG.EVENTS.CALL.SEND_CAPTION, captionObj);
    };
    translateCaption();
  }, [addCaption, transcript, user, user?.language, scrollToBottom]);

  useEffect(() => {
    const captionList = captionListRef.current;
    if (!captionList) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = captionList;
      if (scrollTop + clientHeight >= scrollHeight) {
        setScroll(false);
      } else {
        setScroll(true);
      }
    };
    captionList.addEventListener('scroll', handleScroll);
    return () => {
      captionList.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    socket.on(
      SOCKET_CONFIG.EVENTS.CALL.SEND_CAPTION,
      async (caption: CaptionInterface) => {
        if (caption.user._id == user?._id) return;
        let message = caption.content;
        if (caption.language !== user?.language) {
          message = await translateText(
            caption.content,
            caption.language,
            user?.language || 'en',
          );
        }
        addCaption({
          ...caption,
          isMe: false,
          content: message,
        });
        scrollToBottom();
      },
    );
    return () => {
      socket.off(SOCKET_CONFIG.EVENTS.CALL.SEND_CAPTION);
      clearCaption();
    };
  }, [addCaption, user?._id, user?.language, clearCaption, scrollToBottom]);

  return (
    <section>
      <div className="flex items-center justify-center gap-2 bg-neutral-50 p-1 pl-3 text-primary">
        <ScanText className="h-4 w-4" />
        <span className="flex-1">{t('CONVERSATION.CAPTION')}</span>
        <Button.Icon
          onClick={() => setShowCaption(false)}
          size="sm"
          variant="ghost"
          color="default"
        >
          <XIcon />
        </Button.Icon>
      </div>
      <div className="h-[160px] overflow-auto" ref={captionListRef}>
        {captions.length > 0 &&
          captions.map((caption: any, index: number) => {
            return (
              <div className="flex items-start gap-2 p-3" key={index}>
                <Avatar
                  src={caption.user.avatar}
                  size="xs"
                  alt={caption.user.name}
                />
                <div className="flex-1">
                  <p className="mb-2 text-sm font-semibold">
                    {caption.user.name}
                  </p>
                  <p className="text-sm text-neutral-500">{caption.content}</p>
                  <div className="relative mt-2">
                    <TriangleSmall
                      fill={'#e6e6e6'}
                      position="top"
                      className="absolute left-4 top-0 -translate-y-full"
                    />
                    <div className="mb-1 mt-2 rounded-xl bg-neutral-100 p-1 px-3 text-neutral-600">
                      <Text
                        value={caption.contentEn}
                        className="text-start text-sm font-light"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}