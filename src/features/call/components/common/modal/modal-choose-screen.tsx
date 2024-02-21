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
import { useEffect, useState } from 'react';
import Image from 'next/image';

export const ModalChooseScreen = () => {
    const { showChooseScreen, setChooseScreen } = useVideoCallStore();
    const [sources, setSources] = useState([]);
    useEffect(() => {
        //@ts-ignore
        if (!navigator?.mediaDevices?.getAllSources) return;
        const getAllSource = async () => {
            //@ts-ignore
            const sources = await navigator.mediaDevices.getAllSources();
            setSources(sources);
        }

        getAllSource();
    }, []);

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
                                <div key={source.id} className='w-[120px]'>
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
                    >
                        Share
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
