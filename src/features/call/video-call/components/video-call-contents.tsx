import React from 'react';
import dynamic from 'next/dynamic';
import ChatThread from './chat-thread';
import VideoCallLayout from './layouts';
import useHelpDesk from '../../hooks/use-help-desk';
import { useVideoCallStore } from '../../store/video-call.store';
import { Allotment } from 'allotment';
import { useAppStore } from '@/stores/app.store';
const CaptionSection = dynamic(() => import('./caption'), { ssr: false });

export default function VideoCallContent() {
  const { isHelpDeskCall } = useHelpDesk();
  const isFullScreen = useVideoCallStore((state) => state.isFullScreen);
  const isMobile = useAppStore((state) => state.isMobile);
  const isShowCaptionStore = useVideoCallStore(state => state.isShowCaption);
  const isShowChat = useVideoCallStore(state => state.isShowChat);
  
  const isShowCaption = isShowCaptionStore && isFullScreen;
  

  // Left and right for video call and chat thread
  const isAllowResizeLeftRight = isFullScreen && !isMobile && !isHelpDeskCall && isShowChat  // Condition for resizing left and right

  const WrapperLeftRight = isAllowResizeLeftRight ? Allotment : React.Fragment;
  const propsWrapperLeftRight = isAllowResizeLeftRight ? { defaultSizes: [1000, 400], vertical: false } : {};
  const LeftPane = isAllowResizeLeftRight ? Allotment.Pane : React.Fragment;
  const RightPane = isAllowResizeLeftRight ? Allotment.Pane : React.Fragment;
  const propsLeftPane = isAllowResizeLeftRight ? { minSize: 300, maxSize: 1000, preferredSize: 700 } : {};
  const propsRightPane = isAllowResizeLeftRight ? { minSize: 320, maxSize: 640, preferredSize: 700 } : {};

 // Top and bottom for video call content and caption
  const isAllowResizeTopBottom = isFullScreen && !isMobile && !isHelpDeskCall && isShowCaptionStore // Condition for resizing top and bottom
  const WrapperTopBottom = isAllowResizeTopBottom ? Allotment : React.Fragment;
  const propsWrapperTopBottom = isAllowResizeTopBottom ? { defaultSizes: [800, 200], vertical: true } : {};
  const TopPane = isAllowResizeTopBottom ? Allotment.Pane : React.Fragment;
  const BottomPane = isAllowResizeTopBottom ? Allotment.Pane : React.Fragment;
  const propsTopPane = isAllowResizeTopBottom ? { minSize: 300, maxSize: 800, preferredSize: 700 } : {};
  const propsBottomPane = isAllowResizeTopBottom ? { minSize: 150, maxSize: 400, preferredSize: 200 } : {};

  return (
    <main className="relative flex h-full w-full flex-1 flex-col overflow-hidden md:flex-row">
      <WrapperLeftRight {...propsWrapperLeftRight}>
        <LeftPane {...propsLeftPane}>
          <div className='flex h-full w-full flex-1 flex-col overflow-hidden'>
            <WrapperTopBottom {...propsWrapperTopBottom}>
              <TopPane {...propsTopPane}>
                <section className="relative flex h-full w-full flex-1 justify-center overflow-hidden bg-white dark:bg-neutral-950">
                  <VideoCallLayout />
                </section>
              </TopPane>
              <BottomPane {...propsBottomPane}>
                <CaptionSection className={isShowCaption ? '' : 'hidden'}/>
              </BottomPane>
            </WrapperTopBottom>
          </div>
        </LeftPane>
        {!isHelpDeskCall && 
          <RightPane {...propsRightPane}>
            <ChatThread />
          </RightPane>
        }
      </WrapperLeftRight>
    </main>
  );
}