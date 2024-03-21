import { Button } from '@/components/actions';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { ELECTRON_EVENTS } from '@/configs/electron-events';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import { useElectron } from '@/hooks/use-electron';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { Video, VideoOff } from 'lucide-react';
import React, { memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  const {isElectron, ipcRenderer} = useElectron();
  const onToggleCamera = useCallback(() => {
    setTurnOnCamera(!isTurnOnCamera);
    handleChangeCameraOrMic({
      video: !isTurnOnCamera,
    });
  }, [handleChangeCameraOrMic, isTurnOnCamera, setTurnOnCamera]);
  const {t} = useTranslation('common')
  useKeyboardShortcut([SHORTCUTS.TOGGLE_CAMERA], onToggleCamera);

  useEffect(() => {
    if(!isElectron || !ipcRenderer) return;
    ipcRenderer.on(ELECTRON_EVENTS.TOGGLE_CAMERA, onToggleCamera);
    return () => {
      if(!isElectron || !ipcRenderer) return;
      ipcRenderer.off(ELECTRON_EVENTS.TOGGLE_CAMERA, onToggleCamera)
    }
  }, [ipcRenderer, isElectron, onToggleCamera])

  return (
    <Tooltip
      title={isTurnOnCamera ? t('TOOL_TIP.TURN_OFF_CAMERA') : t('TOOL_TIP.TURN_ON_CAMERA') }
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
