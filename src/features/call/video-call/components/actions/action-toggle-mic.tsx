import { Button } from '@/components/actions';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import { Mic, MicOff } from 'lucide-react';
import React, { memo } from 'react';

interface ActionToggleMicProps {
  handleChangeCameraOrMic: (params: {
    video?: boolean;
    audio?: boolean;
  }) => void;
}
const ActionToggleMic = ({ handleChangeCameraOrMic }: ActionToggleMicProps) => {
  const { isTurnOnMic, setTurnOnMic } = useMyVideoCallStore();
  const onToggleMic = () => {
    setTurnOnMic(!isTurnOnMic);
    handleChangeCameraOrMic({
      audio: !isTurnOnMic,
    });
  };
  return (
    <Button.Icon
      variant="default"
      size="xs"
      color={isTurnOnMic ? 'primary' : 'default'}
      onClick={onToggleMic}
    >
      {isTurnOnMic ? <Mic /> : <MicOff />}
    </Button.Icon>
  );
};

export default memo(ActionToggleMic);
