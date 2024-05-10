import ParticipantInVideoCall from '@/features/call/interfaces/participant';
import { useParticipantVideoCallStore } from '@/features/call/store/participant.store';
import { useVideoCallStore } from '@/features/call/store/video-call.store';
import { Fragment, useMemo } from 'react';
import DoodleItem from '../doodle/doodle-item';
import VideoItem from '../video/video-item';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/stores/app.store';
import { UserPlus2 } from 'lucide-react';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import useGetMemberInRoom from '@/features/call/hooks/use-get-member-in-room';

const GalleryLayout = () => {
  const isMobile = useAppStore(state => state.isMobile);
  const participants = useParticipantVideoCallStore(state => state.participants);
  const isDoodle = useVideoCallStore(state => state.isDoodle);
  const isFullScreen = useVideoCallStore(state => state.isFullScreen);
  const room = useVideoCallStore(state => state.room);
  const numberItem = useMemo(() => participants.length + (isDoodle ? 1 : 0), [isDoodle, participants.length]);
  const [numColumn, numRow] = useMemo(()=>{
    if(isMobile) {
      switch (numberItem) {
        case 1:
          return [1, 1];
        case 2:
          return  [1, 2];
        default:
          return  [2, Math.ceil(numberItem / 2)];
      }
    } 
    // PC
    switch (numberItem) {
      case 1:
        return [1, 1];
      case 2:
        return [2, 1];
      case 3:
      case 4:
        return [2, 2];
      case 5:
      case 6:
        return [3, 2];
      case 7:
      case 8:
        return [4, 2];
      case 9:
        return [3, 3];
      case 10:
      case 11:
      case 12:
        return [4, 3];
      default:
        return [4, Math.ceil(numberItem / 4)];
    }
  }, [isMobile, numberItem])
  const numberParticipant = useMemo(() => {
    const members = participants.filter((p: ParticipantInVideoCall) => !p.isShareScreen);
    return members.length;
  }, [participants]);

  const { members } = useGetMemberInRoom({roomId: room.roomId});

  const renderLayout = () => {
    // CASE NOT FULL SCREEN
    if(!isFullScreen) {

      return <div className='grid grid-cols-4'>
        {isDoodle && <DoodleItem />}
        {participants.map(
          (participant: ParticipantInVideoCall, index: number) => {
            const key = participant.user._id + participant.isShareScreen;
            if(index == (isDoodle ? 5 : 6) && numberItem > 7) {
              const remain = numberItem - 7;
              return <div key={key} className='h-full w-full relative'>
                <VideoItem isGalleryView participant={participant} />
                <ItemNumber numberItem={remain} />
              </div>
            }
            const isHidden = index > (isDoodle ? 5 : 6) && numberItem > 7;
            return ( <div
              key={key}
              className={cn('h-full w-full', isHidden ? 'hidden' : '')}>
              <VideoItem isGalleryView participant={participant} />
            </div>
          )},
        )}
        {members.length > 2 && (members.length > numberParticipant) && <AddUserItem />}
      </div>
    }
    let result = []
    for(let i = 0; i < numRow; i++) {
      let html = [];
      if(i == 0 && isDoodle) {
        html.push(
          <div 
            key="doodle" 
            className={cn('w-full h-full', numColumn > 1 && `w-1/${numColumn}` )}>
              <DoodleItem />
          </div>)
      }
      for(let j = 0; j < numColumn; j++) {
        if(i == 0 && j == 0 && isDoodle) continue;
        const index = i * numColumn + j - (isDoodle ? 1 : 0);
        if(!participants[index]) continue;
        html.push(<div
          key={participants[index].socketId  + participants[index].isShareScreen}
          className={cn('w-full h-full', numColumn > 1 && `w-1/${numColumn}` )}>
          <VideoItem isGalleryView participant={participants[index]} />
        </div>)
      }
      result.push(<div 
        className={cn('flex justify-center items-center h-full', numRow > 1 && `md:h-1/${numRow}`)} key={i}
        style={{
          height: isMobile ? '100%' : `calc(100% / ${numRow})`
        }}
        >{html}</div>)
    }
    return result;
  };


  if(participants.length === 0) return <Fragment></Fragment>

  return (
    <div className="h-full w-full overflow-auto md:overflow-hidden">
      <div
        className={`w-full min-h-full grid md:block md:h-full p-2 `}
      >
        { renderLayout() }

      </div>
    </div>
  );
};

const ItemNumber = ({ numberItem }: { numberItem: number }) => {
  const setFullScreen = useVideoCallStore(state => state.setFullScreen);
  return <div className="h-full w-full absolute inset-0 px-2 py-[2px] cursor-pointer z-10" onClick={() => setFullScreen(true)}>
      <p className='relative flex h-full w-full items-center justify-center rounded-2xl bg-black/60 font-medium text-white'>
        {numberItem}+
      </p>
    </div>
};

const AddUserItem = () => {
  const setModalAddUser = useVideoCallStore((state) => state.setModalAddUser);
  const isShowModalAddUser = useVideoCallStore((state) => state.isShowModalAddUser);
    
  useKeyboardShortcut([SHORTCUTS.ADD_MEMBERS], () => {
    setModalAddUser(!isShowModalAddUser);
  });

  return <div className='h-full w-full relative flex items-center justify-center'>
    <div className='rounded-xl text-neutral-700 w-[60px] h-[60px] bg-neutral-50 flex items-center justify-center p-[2px]  md:hover:opacity-80 cursor-pointer' onClick={() => setModalAddUser(true)}>
      <UserPlus2></UserPlus2>
    </div>
  </div>
}

export default GalleryLayout;
