import { Button } from '@/components/actions';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import { Video, VideoOff } from 'lucide-react';
import React, { memo } from 'react';

interface ActionToggleCameraProps {
  handleChangeCameraOrMic: (params: {
    video?: boolean;
    audio?: boolean;
  }) => void;
}
const ActionToggleCamera = ({
  handleChangeCameraOrMic,
}: ActionToggleCameraProps) => {
  const { isTurnOnCamera, setTurnOnCamera } = useMyVideoCallStore();
  const onToggleCamera = () => {
    setTurnOnCamera(!isTurnOnCamera);
    handleChangeCameraOrMic({
      video: !isTurnOnCamera,
    });
  };
  return (
    <Tooltip
      title={isTurnOnCamera ? 'Turn off camera' : 'Turn on camera'}
      triggerItem={
        <Button.Icon
          variant="default"
          size="xs"
          color={isTurnOnCamera ? 'primary' : 'default'}
          onClick={onToggleCamera}
        >
          {isTurnOnCamera ? <Video /> : <VideoOff />}
        </Button.Icon>
      }
    />
  );
};

export default memo(ActionToggleCamera);
