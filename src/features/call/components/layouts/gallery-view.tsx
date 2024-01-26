import { Fragment, useMemo } from 'react';
import VideoItem from '../common/video-item';
import { useVideoCallStore } from '../../store/video-call.store';
import { useParticipantVideoCallStore } from '../../store/participant.store';
import DoodleItem from '../common/doodle-item';
import ParticipantInVideoCall from '../../interfaces/participant';
import { VIDEOCALL_LAYOUTS } from '../../constant/layout';

const GalleryView = () => {
  const { participants } = useParticipantVideoCallStore();
  const { isDoodle, isFullScreen } = useVideoCallStore();
  const classes = useMemo(() => {
    if (!isFullScreen) return 'grid-cols-4';
    const numberItem = participants.length + (isDoodle ? 1 : 0);
    switch (numberItem) {
      case 1:
        return 'grid-cols-1 grid-rows-1';
      case 2:
        return 'grid-cols-2 grid-rows-1';
      case 3:
        return 'grid-cols-2 md:grid-cols-3 grid-rows-1';
      case 4:
        return 'grid-cols-2 grid-rows-2';
      case 5:
      case 6:
        return 'grid-cols-2 md:grid-cols-3 grid-rows-2';
      case 7:
      case 8:
      case 9:
        return 'grid-cols-2 md:grid-cols-3 grid-rows-3';
      default:
        return 'grid-cols-2 md:grid-cols-3 grid-rows-3';
    }
  }, [isDoodle, isFullScreen, participants.length]);
  return (
    <div
      className={`grid h-full w-full content-center items-center justify-center overflow-auto p-2 md:overflow-hidden ${classes}`}
    >
      {isDoodle && <DoodleItem />}
      {participants.map(
        (participant: ParticipantInVideoCall, index: number) => (
          <VideoItem isGalleryView key={index} participant={participant} />
        ),
      )}
    </div>
  );
};

export default GalleryView;
