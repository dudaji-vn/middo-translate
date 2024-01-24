import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useVideoCallStore } from '../store/video-call.store'
import { ScanText, XIcon } from 'lucide-react';
import { Avatar, Text } from '@/components/data-display';
import { Button } from '@/components/actions';
import { TriangleSmall } from '@/components/icons/triangle-small';
import useExtractTextFromStream from '../hooks/use-extract-text-from-stream';
import { useAuthStore } from '@/stores/auth.store';
import { translateText } from '@/services/languages.service';
import socket from '@/lib/socket-io';
import { SOCKET_CONFIG } from '@/configs/socket';
import CaptionInterface from '../interfaces/caption.interface';
import { useMyVideoCallStore } from '../store/me.store';

export default function CaptionSection() {
    const { isFullScreen, isShowCaption, setShowCaption, captions, addCaption, clearCaption } = useVideoCallStore();
    const { user } = useAuthStore();
    const { myStream } = useMyVideoCallStore();
    const captionListRef = useRef<HTMLDivElement>(null);
    const { transcript } = useExtractTextFromStream(myStream);
    const [isScroll, setScroll] = useState(false);

    const scrollToBottom = useCallback((isForceScroll = false) => {
        if (isScroll && !isForceScroll) return;
        setTimeout(() => {
            captionListRef.current?.scrollTo({
                top: captionListRef.current.scrollHeight + 200,
                behavior: 'smooth'
            })
        }, 500)
    }, [isScroll])

    useEffect(() => {
        if (!transcript) return;
        const myLanguage = user?.language || 'en';
        const translateCaption = async () => {
            let contentEn = transcript;
            if (myLanguage !== 'en') {
                contentEn = await translateText(
                    transcript,
                    myLanguage,
                    'en'
                )
            }
            const captionObj = {
                user,
                content: transcript,
                contentEn: contentEn,
                language: myLanguage
            }
            addCaption({
                ...captionObj,
                isMe: true
            })
            scrollToBottom()
            socket.emit(SOCKET_CONFIG.EVENTS.CALL.SEND_CAPTION, captionObj)
        }
        translateCaption();
    }, [addCaption, transcript, user, user?.language, scrollToBottom])

    useEffect(() => {
        const captionList = captionListRef.current;
        if (!captionList) return;
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = captionList;
            if (scrollTop + clientHeight >= scrollHeight) {
                setScroll(false)
            } else {
                setScroll(true)
            }
        }
        captionList.addEventListener('scroll', handleScroll)
        return () => {
            captionList.removeEventListener('scroll', handleScroll)
        }
    }, [])

    useEffect(() => {
        socket.on(SOCKET_CONFIG.EVENTS.CALL.SEND_CAPTION, async (caption: CaptionInterface) => {
            if (caption.user._id == user?._id) return;
            let message = caption.content;
            if (caption.language !== user?.language) {
                message = await translateText(
                    caption.content,
                    caption.language,
                    user?.language || 'en'
                )
            }
            addCaption({
                ...caption,
                isMe: false,
                content: message
            })
            scrollToBottom()
        })
        return () => {
            socket.off(SOCKET_CONFIG.EVENTS.CALL.SEND_CAPTION)
            clearCaption()
        }
    }, [addCaption, user?._id, user?.language, clearCaption, scrollToBottom])

    if (!isFullScreen || !isShowCaption) return null;

    return (
        <section >
            <div className='bg-neutral-50 p-1 pl-3 flex items-center justify-center text-primary gap-2'>
                <ScanText className='w-4 h-4' />
                <span className='flex-1'>Caption</span>
                <Button.Icon
                    onClick={() => setShowCaption(false)}
                    size="sm"
                    variant="ghost"
                    color="default"
                >
                    <XIcon />
                </Button.Icon>
            </div>
            <div className='h-[160px] overflow-auto' ref={captionListRef}>
                {captions.length > 0 && captions.map((caption, index) => {
                    return <div className='p-3 flex items-start gap-2' key={index}>
                        <Avatar src={caption.user.avatar} size='xs' alt={caption.user.name} />
                        <div className='flex-1'>
                            <p className='font-semibold mb-2 text-sm'>{caption.user.name}</p>
                            <p className='text-sm text-neutral-500'>{caption.content}</p>
                            <div className="relative mt-2">
                                <TriangleSmall
                                    fill={'#e6e6e6'}
                                    position="top"
                                    className="absolute left-4 top-0 -translate-y-full"
                                />
                                <div
                                    className='mb-1 mt-2 rounded-xl p-1 px-3 bg-neutral-100 text-neutral-600'
                                >
                                    <Text
                                        value={caption.contentEn}
                                        className="text-start text-sm font-light"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </section>
    )
}
