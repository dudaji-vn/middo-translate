'use client';

import { useVideoCallStore } from '../store';
import GalleryView from './layouts/gallery-view';
import FocusScreenView from './layouts/focus-screen-view';
import { VIDEOCALL_LAYOUTS } from '../constant/layout';
export default function VideoCallContent() {

    const { layout, isDoodle, participants } = useVideoCallStore();
    const haveShareScreen = participants.some(participants => participants.isShareScreen);

    if(isDoodle || haveShareScreen) {
        return <FocusScreenView />
    }

    switch (layout) {
        case VIDEOCALL_LAYOUTS.GALLERY_VIEW:
            return <GalleryView />;
        case VIDEOCALL_LAYOUTS.SHARE_SCREEN:
            return <FocusScreenView />;
        default:
            return <GalleryView />;
    }
}

