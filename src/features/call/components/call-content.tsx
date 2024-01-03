'use client';

import { useEffect, useState } from 'react';
import { LAYOUTS, useVideoCallStore } from '../store';
import ViewLayout from './layouts/view-layout';
import ShareScreenLayout from './layouts/share-screen-layout';
export default function VideoCallContent() {

    const { participants, layout, setLayout } = useVideoCallStore();
    useEffect(() => {
        // const isHaveShareScreen = participants.some((participant) => participant.isShareScreen);
        // if (isHaveShareScreen && layout !== 'SHARE_SCREEN') {
        //     setLayout('SHARE_SCREEN');
        // } else if (!isHaveShareScreen && layout !== 'VIEW') {
        //     setLayout('VIEW');
        // }
    }, [layout, participants, setLayout]);

    switch (layout) {
        case LAYOUTS.VIEW:
            return <ViewLayout />;
        case LAYOUTS.SHARE_SCREEN:
            return <ShareScreenLayout />;
        default:
            return <ViewLayout />;
    }
}

