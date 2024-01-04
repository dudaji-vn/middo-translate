'use client';

import { useVideoCallStore } from '../store';
import GalleryView from './layouts/gallery-view';
import ShareScreenLayout from './layouts/share-screen-view';
import { VIDEOCALL_LAYOUTS } from '../constant/layout';
export default function VideoCallContent() {

    const { layout } = useVideoCallStore();

    switch (layout) {
        case VIDEOCALL_LAYOUTS.GALLERY_VIEW:
            return <GalleryView />;
        case VIDEOCALL_LAYOUTS.SHARE_SCREEN:
            return <ShareScreenLayout />;
        default:
            return <GalleryView />;
    }
}

