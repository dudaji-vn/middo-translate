'use client';

import { useVideoCallStore } from '@/features/call/store/video-call.store';
import VideoCall from '@/features/call/video-call';
import { useAuthStore } from '@/stores/auth.store';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Call() {
    const user = useAuthStore(state => state.user);
    const room = useVideoCallStore(state => state.room);
    const router = useRouter();
    const isFullScreen = useVideoCallStore(state=>state.isFullScreen)
    const setFullScreen = useVideoCallStore(state=>state.setFullScreen)
    const pathName = usePathname();
    useEffect(() => {
        if (!room || !user) {
            router.push(`${pathName}/enter-info`);
        }
    }, [room, user, router]);

    useEffect(()=>{
        if(!isFullScreen) setFullScreen(true)
    }, [isFullScreen])
    if(!room || !user ) return null;

    return ( 
        <VideoCall isShowFullScreenButton={false}/>
    );
}
