//@ts-nocheck
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/feedback';
import { useVideoCallStore } from '../../../store/video-call.store';
import { useParticipantVideoCallStore } from '../../../store/participant.store';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import socket from '@/lib/socket-io';
import { useAuthStore } from '@/stores/auth.store';
import { SOCKET_CONFIG } from '@/configs/socket';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import toast from 'react-hot-toast';
import { useElectron } from '@/hooks/use-electron';
import { ELECTRON_EVENTS } from '@/configs/electron-events';
interface MediaSource {
    id: string;
    thumbnail: string;
    name: string;
}
export const ModalChooseScreen = () => {
    const { showChooseScreen, setChooseScreen } = useVideoCallStore();
    const [selectedSource, setSelectedSource] = useState<MediaSource>();
    const [sources, setSources] = useState<MediaSource[]>([]);
    const { user } = useAuthStore();
    const { addParticipant } = useParticipantVideoCallStore();
    const { setShareScreen, setShareScreenStream, isTurnOnMic, isTurnOnCamera} = useMyVideoCallStore();
    const { room } = useVideoCallStore();
    const { ipcRenderer } = useElectron();
    
    const setSourceList = useCallback((sources: MediaSource[]) => {
        setSources(sources);
    }, [])

    useEffect(() => {
        if (!ipcRenderer) return;
        ipcRenderer.on(ELECTRON_EVENTS.GET_SCREEN_SOURCE, setSourceList);
        return () => {
            if (!ipcRenderer) return;
            ipcRenderer.off(ELECTRON_EVENTS.GET_SCREEN_SOURCE, setSourceList);
        };
    }, [ipcRenderer, setSourceList]);

    const handleShareScreen = useCallback(async ()=>{
        try {
            if (!socket.id || !selectedSource) return;
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                  mandatory: {
                    chromeMediaSource: "desktop",
                    chromeMediaSourceId: selectedSource.id,
                    // minWidth: 1280,
                    // maxWidth: 1280,
                    // minHeight: 720,
                    // maxHeight: 720,
                  },
                },
              });
            const shareScreen = {
                stream,
                user: user,
                isMe: true,
                isShareScreen: true,
                socketId: socket.id,
                isElectron: true,
            };
            addParticipant(shareScreen);
            setShareScreen(true);
            setShareScreenStream(stream);
            socket.emit(SOCKET_CONFIG.EVENTS.CALL.SHARE_SCREEN, room?._id); 
            ipcRenderer.send(ELECTRON_EVENTS.SHARE_SCREEN_SUCCESS, {
                mic: isTurnOnMic,
                camera: isTurnOnCamera,
            });      
        } catch (err: unknown) {
            if (err instanceof Error && err.name !== 'NotAllowedError') {
                toast.error('Device not supported for sharing screen');
            }
        }
        setChooseScreen(false)
    }, [addParticipant, ipcRenderer, isTurnOnCamera, isTurnOnMic, room?._id, selectedSource, setChooseScreen, setShareScreen, setShareScreenStream, user])

    return (
        <AlertDialog open={showChooseScreen} onOpenChange={() => setChooseScreen(false)}>
            <AlertDialogContent className="min-w-[80%]" >
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Sharing Screen
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This application will be able to see the contents of your screen.
                    </AlertDialogDescription>
                    <div className='grid grid-cols-4 gap-3 mt-3'>
                        {sources.map((source: any) => {
                            return (
                                <div key={source.id} 
                                    className={cn('p-2 border rounded-2xl cursor-pointer',selectedSource?.id === source.id ? 'border-2 border-primary' : 'border-neutral-50')}
                                    onClick={()=>setSelectedSource(source)}>
                                    <div className='w-full rounded-xl overflow-hidden aspect-video'>
                                        <Image 
                                            src={source.thumbnail}
                                            alt=''
                                            width={1000}
                                            height={1000}
                                        />
                                    </div>
                                    <p className='truncate mt-[10px]'>{source.name}</p>
                                </div>
                            )
                        })}
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="sm:mr-3">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        type="submit"
                        className="bg-primary text-background active:!bg-primary-darker md:hover:bg-primary-lighter"
                        disabled={!selectedSource}
                        onClick={handleShareScreen}
                    >
                        Share
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
