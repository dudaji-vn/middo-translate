'use client';

import { useMyVideoCallStore } from '@/features/call/store/me.store';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import VideoCallActions from '@/features/call/video-call/components/video-call-actions';
import VideoItem from '@/features/call/video-call/components/video/video-item';
import socket from '@/lib/socket-io';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app.store';
import Image from 'next/image';
import getUserStream from '@/features/call/utils/get-user-stream';
import customToast from '@/utils/custom-toast';
import JoinCallForm from './_component/join-call-form';

export default function CallEnterInfo() {
    const { t } = useTranslation('common');
    const myStream = useMyVideoCallStore((state) => state.myStream);
    const setFullScreen = useVideoCallStore((state) => state.setFullScreen);
    const isTurnOnCamera = useMyVideoCallStore((state) => state.isTurnOnCamera);
    const isTurnOnMic = useMyVideoCallStore((state) => state.isTurnOnMic);
    const setTurnOnCamera = useMyVideoCallStore((state) => state.setTurnOnCamera);
    const setTurnOnMic = useMyVideoCallStore((state) => state.setTurnOnMic);
    const setMyStream = useMyVideoCallStore((state) => state.setMyStream);
    const isMobile = useAppStore((state) => state.isMobile);

    useEffect(() => {
        setFullScreen(true);
    }, []);
    useEffect(() => {
        let myVideoStream: MediaStream = new MediaStream();
        getUserStream({
            isTurnOnCamera: true,
            isTurnOnMic: true,
        })
        .then((stream: MediaStream) => {
            myVideoStream = stream;
            setTurnOnMic(true);
            setTurnOnCamera(true);
        })
        .catch((_) => {
            setTurnOnCamera(false);
            setTurnOnMic(false);
            customToast.error(t('MESSAGE.ERROR.NO_ACCESS_MEDIA'));
        })
        .finally(() => {
            setMyStream(myVideoStream);
        });
        return () => {
            myVideoStream.getTracks().forEach((track) => {
                track.stop();
            });
        }
    }, [setMyStream, setTurnOnCamera, setTurnOnMic]);


    
    return (
        <div>
            <div className="relative h-dvh w-full flex-1 overflow-hidden flex md:flex-row flex-col-reverse">
                <div className="flex md:h-full w-full flex-col overflow-hidden">
                    <div className="flex-1 overflow-hidden">
                        {myStream && <VideoItem
                            isShowExpand={false}
                            participant={{
                                socketId: socket.id || '',
                                stream: myStream,
                                isTurnOnCamera: isTurnOnCamera,
                                isTurnOnMic: isTurnOnMic,
                                user: {
                                    _id: '',
                                    name: 'You',
                                    avatar: '',
                                    email: '',
                                    language: '',
                                    status: 'active',
                                    username: '',
                                    allowUnknown: true,
                                },
                            }}
                        />}
                    </div>
                    <VideoCallActions 
                        isShowEndCall={false}
                        isShowDrawer={false}
                        isShowChat={false}
                        isShowShareScreen={false}
                        isShowToggleCaption={false}
                        isShowDropdown={false}
                        className='gap-6 justify-center'
                    />
                </div>
                <motion.div
                    layout
                    transition={{ delay: 0.5 }}
                    initial={{ width: 0, opacity: 0}}
                    animate={{ width: isMobile ? '100%' : 400, opacity: 1}}
                    exit={{ width: 0, opacity: 0}}
                    className='bg-white md:h-full md:overflow-auto w-full md:w-[400px] md:min-w-[400px] dark:bg-background border-l dark:border-neutral-900 flex-1 overflow-visible'>
                    <div className="p-5 md:pt-12">
                        <div>
                            <Image src='/logo.png' alt="Middo" width={106} height={60} className="mx-auto"/>
                            <p className='text-sm text-neutral-400 text-center mt-3'>{t('NEW_CALL.TEXT_1')}</p>
                        </div>
                        <div className='mt-5 md:mt-10'>
                            <JoinCallForm />
                        </div>
                    </div>
                </motion.div>         
            </div>
        </div>
    );
}
