import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
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
    const { setShareScreen, setShareScreenStream} = useMyVideoCallStore();
    const { room } = useVideoCallStore();

    useEffect(() => {
        //@ts-ignore
        if (!navigator?.mediaDevices?.getAllSources) return;
        const getAllSource = async () => {
            //@ts-ignore
            const sources = await navigator.mediaDevices.getAllSources();
            setSources(sources);
            console.log(sources)
        }

        getAllSource();
    }, []);

    const handleShareScreen =useCallback(async ()=>{
        try {
            if (!socket.id || !selectedSource) return;
            //@ts-ignore
            let stream: MediaStream = await navigator.mediaDevices.getDisplayMedia(selectedSource.id)
            const shareScreen = {
                stream,
                user: user,
                isMe: true,
                isShareScreen: true,
                socketId: socket.id,
            };
            addParticipant(shareScreen);
            setShareScreen(true);
            setShareScreenStream(stream);
            socket.emit(SOCKET_CONFIG.EVENTS.CALL.SHARE_SCREEN, room?._id);
        } catch (err: unknown) {
            if (err instanceof Error && err.name !== 'NotAllowedError') {
                toast.error('Device not supported for sharing screen');
            }
        }
        setChooseScreen(false)
    }, [addParticipant, room?._id, selectedSource, setChooseScreen, setShareScreen, setShareScreenStream, user])

    return (
        <AlertDialog open={showChooseScreen} onOpenChange={() => setChooseScreen(false)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Chooose screen
                    </AlertDialogTitle>
                    <div className='flex gap-x-1 gap-y-3 justify-around flex-wrap'>
                        {sources.map((source: any) => {
                            return (
                                <div key={source.id} 
                                    className={cn('w-[120px]', selectedSource?.id === source.id ? 'border-2 border-primary' : 'border-2 border-transparent')}
                                    onClick={()=>setSelectedSource(source)}>
                                    <h4 className='truncate'>{source.name}</h4>
                                    <div className='w-full'>
                                        <Image 
                                            src={source.thumbnail}
                                            alt=''
                                            width={1000}
                                            height={1000}
                                        />
                                    </div>
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
