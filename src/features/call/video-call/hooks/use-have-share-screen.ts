import { useMemo } from 'react';
import { useParticipantVideoCallStore } from '../../store/participant.store';

export default function useHaveShareScreen() {
  const participants = useParticipantVideoCallStore(
    (state) => state.participants,
  );
  const haveShareScreen = useMemo(() => {
    return participants.some((p) => p.isShareScreen);
  }, [participants]);

  return haveShareScreen;
}
