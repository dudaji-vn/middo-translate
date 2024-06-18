import { VIDEO_CALL_LAYOUTS } from '@/features/call/constant/layout';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import React from 'react'
import GalleryLayout from './gallery-layout';
import FocusScreenLayout from './focus-screen-layout';

export default function VideoCallLayout() {
  
    const layout = useVideoCallStore(state => state.layout);
    const isFullScreen = useVideoCallStore(state => state.isFullScreen);

    if (!isFullScreen) return <GalleryLayout />;
    switch (layout) {
      case VIDEO_CALL_LAYOUTS.GALLERY_VIEW:
        return <GalleryLayout />;
      case VIDEO_CALL_LAYOUTS.FOCUS_VIEW:
        return <FocusScreenLayout />;
      default:
        return <GalleryLayout />;
    }
}
