import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScanText, XIcon } from 'lucide-react';
import { Avatar, Text } from '@/components/data-display';
import { Button } from '@/components/actions';
import { TriangleSmall } from '@/components/icons/triangle-small';
import { useVideoCallStore } from '../../store/video-call.store';
import CaptionInterface from '../../interfaces/caption.interface';
import { useTranslation } from 'react-i18next';
import { listenEvent } from '../../utils/custom-event.util';
import { CUSTOM_EVENTS } from '@/configs/custom-event';
import { useAppStore } from '@/stores/app.store';

export default function CaptionSection() {
  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  const isShowCaption = useVideoCallStore(state => state.isShowCaption);
  if (!isFullScreen || !isShowCaption) return null;
  return <CaptionContent />;
}


const CaptionContent = () => {
  const {t} = useTranslation('common')
  const theme = useAppStore(state => state.theme);
  const setShowCaption = useVideoCallStore(state => state.setShowCaption);
  const captions = useVideoCallStore(state => state.captions);
  const addCaption = useVideoCallStore(state => state.addCaption);
  const clearCaption = useVideoCallStore(state => state.clearCaption);
  const captionListRef = useRef<HTMLDivElement>(null);

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
    const cleanup = listenEvent(CUSTOM_EVENTS.CAPTION.SEND_CAPTION, (event: {detail: CaptionInterface}) => {
      const { detail: caption } = event
      addCaption(caption);
      scrollToBottom();
    });

    return () => {
      cleanup();
    };
  }, [addCaption, scrollToBottom]);

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


  return (
    <section>
      <div className="flex items-center justify-center gap-2 bg-neutral-50 p-1 pl-3 text-primary dark:bg-neutral-950 dark:border-b dark:border-neutral-800 dark:border-t">
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
      <div className="h-[160px] overflow-auto  dark:bg-neutral-950" ref={captionListRef}>
        {captions.length > 0 &&
          captions.map((caption: CaptionInterface, index: number) => {
            return (
              <div className="flex items-start gap-2 p-3" key={index}>
                <Avatar
                  src={caption.user?.avatar}
                  size="xs"
                  alt={caption.user?.name}
                />
                <div className="flex-1">
                  <p className="mb-2 text-sm font-semibold">
                    {caption.user.name}
                  </p>
                  <p className="text-sm text-neutral-500">{caption.content}</p>
                  <div className="relative mt-2">
                    <TriangleSmall
                      fill={theme == 'light' ? '#e6e6e6' : '#191919'}
                      position="top"
                      className="absolute left-4 top-0 -translate-y-full"
                    />
                    <div className="mb-1 mt-2 rounded-xl bg-neutral-100 p-1 px-3 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-50">
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