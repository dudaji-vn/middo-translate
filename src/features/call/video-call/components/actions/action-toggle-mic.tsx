import { Button } from '@/components/actions';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
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
      <Tooltip
        title={isTurnOnMic ? 'Turn off mic' : 'Turn on mic'}
        contentProps={{ className: 'text-black font-normal ' }}
        triggerItem={isTurnOnMic ? <Mic /> : <MicOff />}
      />
    </Button.Icon>
  );
};

export default memo(ActionToggleMic);
