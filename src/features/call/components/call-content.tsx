'use client';

import { useMemo } from 'react';
import { useVideoCallStore } from '../store';
import VideoItem from './video-item';
export default function VideoCallContent() {
    return (
        <ViewLayout />
    );
}

const ViewLayout = () => {
    const { participants } = useVideoCallStore();
    const calculateGridLayout = useMemo(() => {
        return Math.ceil(Math.sqrt(participants.length));
    }, [participants.length]);
    return (
        <div className={`grid grid-cols-${calculateGridLayout} grid-rows-${calculateGridLayout} gap-1`}>
            {participants.map((participant, index) => (
                <VideoItem key={index} participant={participant} />
            ))}
        </div>
    );
};