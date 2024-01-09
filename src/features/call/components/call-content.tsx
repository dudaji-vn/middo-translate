'use client';

import GalleryView from './layouts/gallery-view';
import FocusScreenView from './layouts/focus-screen-view';
import { VIDEOCALL_LAYOUTS } from '../constant/layout';
import { useVideoCallStore } from '../store/video-call';
import { useParticipantVideoCallStore } from '../store/participant';
export default function VideoCallContent() {

    const { layout, isDoodle } = useVideoCallStore();
    const { participants } = useParticipantVideoCallStore()
    const haveShareScreen = participants.some(participants => participants.isShareScreen);

    if(isDoodle || haveShareScreen) {
        return <FocusScreenView />
    }
    return <GalleryView />

    // switch (layout) {
    //     case VIDEOCALL_LAYOUTS.GALLERY_VIEW:
    //         return <GalleryView />;
    //     case VIDEOCALL_LAYOUTS.SHARE_SCREEN:
    //         return <FocusScreenView />;
    //     default:
    //         return <GalleryView />;
    // }
}

