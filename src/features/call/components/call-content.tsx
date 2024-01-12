'use client';

import GalleryView from './layouts/gallery-view';
import FocusScreenView from './layouts/focus-screen-view';
import { VIDEOCALL_LAYOUTS } from '../constant/layout';
import { useVideoCallStore } from '../store/video-call.store';

export default function VideoCallContent() {

    const { layout, isFullScreen } = useVideoCallStore();
    if(!isFullScreen) return <GalleryView />;
    switch (layout) {
        case VIDEOCALL_LAYOUTS.GALLERY_VIEW:
            return <GalleryView />;
        case VIDEOCALL_LAYOUTS.FOCUS_VIEW:
            return <FocusScreenView />;
        default:
            return <GalleryView />;
    }
}

