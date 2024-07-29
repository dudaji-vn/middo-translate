'use client';

import { ACCESS_TOKEN_NAME } from '@/configs/store-key';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import VideoCall from '@/features/call/video-call';
import { setCookieService } from '@/services/auth.service';
import { loggedUserJoinAnonymousCall, userJoinAnonymousCall } from '@/services/video-call.service';
import { useAuthStore } from '@/stores/auth.store';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Call() {
    const user = useAuthStore(state => state.user);
    const isLoaded = useAuthStore(state => state.isLoaded);
    const call = useVideoCallStore(state => state.call);
    const router = useRouter();
    const isFullScreen = useVideoCallStore(state=>state.isFullScreen)
    const setFullScreen = useVideoCallStore(state=>state.setFullScreen)
    const setCall = useVideoCallStore(state =>state.setCall)
    const pathName = usePathname();
    const params = useParams();
    const callId = params?.id;
    useEffect(() => {
        const joinCall = async () => {
            if (!user || call) return;
            const res = await loggedUserJoinAnonymousCall({
                callId: typeof callId == 'string'? callId : ''
            });
            const data = res.data;
            const {call: c} = data
            setCall(c)
            setFullScreen(true)
        };
        if(!isLoaded) return;
        if (!user?._id) {
            router.push(`${pathName}/enter-info`);
        } else {
            joinCall();
        }
    }, [call, user, router, isLoaded, callId]);

    useEffect(()=>{
        if(!isFullScreen) setFullScreen(true)
    }, [isFullScreen])
    if(!call || !user ) return null;

    return ( 
        <VideoCall isShowFullScreenButton={false}/>
    );
}
