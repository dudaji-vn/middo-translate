'use client';

import { useVideoCallStore } from '../../store/video-call.store';
import { Avatar } from '@/components/data-display';
import { useAppStore } from '@/stores/app.store';
import { PropsWithChildren, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const ReceiveVideoCallContent = () => {
  const requestCall = useVideoCallStore(state => state.requestCall);
  const isMobile = useAppStore((state) => state.isMobile);
  const {t} = useTranslation('common')
  console.log(requestCall)
  const generateContent = useMemo(() => {
    switch (requestCall?.type) {
      case 'direct':
        return <Content 
                avatar={requestCall?.user?.avatar}
                altAvatar={requestCall?.user?.name}
                subAvatar={requestCall?.room?.station?.avatar}
                altSubAvatar={requestCall?.room?.station?.name}
                title={requestCall?.user?.name || ''}
              >
                <p>{t('CONVERSATION.CALLING')}</p>
              </Content>
      case 'group':
        return <Content
                avatar={requestCall?.room?.avatar}
                altAvatar={requestCall?.room?.name}
                subAvatar={requestCall?.room?.station?.avatar}
                altSubAvatar={requestCall?.room?.station?.name}
                title={requestCall?.room?.name || ''}
              >
                <div>
                  <Avatar
                    size={'xs'}
                    src={requestCall?.user?.avatar || '/person.svg'}
                    alt={requestCall?.user?.name || 'Avatar'}
                    className='w-4 h-4'
                  />
                </div>
                <p>{requestCall?.user?.name} {t('CONVERSATION.CALLING')}</p>
              </Content>
      case 'help_desk':
        return <Content 
                avatar={requestCall?.room?.space?.avatar}
                altAvatar={requestCall?.room?.space?.name}
                title={requestCall?.room?.space?.name || ''}
              >
                <div>
                  <Avatar
                    size={'xs'}
                    src={requestCall?.user?.avatar || '/person.svg'}
                    alt={requestCall?.user?.name || 'Avatar'}
                    className='w-4 h-4'
                  />
                </div>
                <p>{requestCall?.user?.name} {t('CONVERSATION.FORWARDING')}</p>
              </Content>
      default:
        return null;
    }
  }, []);
  return (
    <div className="relative h-full flex-1 flex justify-center items-center flex-col md:block overflow-hidden">
      {generateContent}
    </div>
  );
};

interface ContentProps {
  avatar?: string;
  altAvatar?: string;
  subAvatar?: string;
  altSubAvatar?: string;
  title: string;
}
const Content = memo(({avatar, altAvatar, subAvatar, altSubAvatar, title, children}: ContentProps & PropsWithChildren) => {
  const isMobile = useAppStore((state) => state.isMobile);
  return <div className='flex flex-col justify-center gap-2 items-center h-full'>
  <div className='relative flex flex-col gap-2 justify-center items-center'>
    <div className="flex items-center justify-center relative w-fit">
      <Avatar
        size={isMobile ? '4xl' : 'md'}
        src={avatar || '/person.svg'}
        alt={altAvatar || 'Avatar'}
      />
      {subAvatar && 
      <div className='absolute bottom-0 right-0 w-fit h-fit border-2 border-white dark:border-background overflow-hidden rounded-full'>
        <Avatar
          size={isMobile ? '4xl' : 'md'}
          src={subAvatar || '/icon.png'}
          alt={altSubAvatar || 'Station'}
          className='w-5 h-5'
        />
      </div>}
    </div>
    <p className="text-center font-semibold dark:text-neutral-50">{title}</p>
  </div>
  <div className='text-center text-sm font-light dark:text-neutral-50 flex justify-center items-center gap-1'>
    {children}
  </div>
</div>
})

Content.displayName = 'Content'



export default memo(ReceiveVideoCallContent);
