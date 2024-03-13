import { Button } from '@/components/actions';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { ELECTRON_EVENTS } from '@/configs/electron-events';
import { useMyVideoCallStore } from '@/features/call/store/me.store';
import { useElectron } from '@/hooks/use-electron';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts';
import { SHORTCUTS } from '@/types/shortcuts';
import { Mic, MicOff } from 'lucide-react';
import React, { memo, useCallback, useEffect } from 'react';

interface ActionToggleMicProps {
  handleChangeCameraOrMic: (params: {
    video?: boolean;
    audio?: boolean;
  }) => void;
}
const ActionToggleMic = ({ handleChangeCameraOrMic }: ActionToggleMicProps) => {
  const { isTurnOnMic, setTurnOnMic } = useMyVideoCallStore();
  const {isElectron, ipcRenderer} = useElectron();
  const onToggleMic = useCallback(() => {
    setTurnOnMic(!isTurnOnMic);
    handleChangeCameraOrMic({
      audio: !isTurnOnMic,
    });
  }, [handleChangeCameraOrMic, isTurnOnMic, setTurnOnMic])

  useKeyboardShortcut([SHORTCUTS.TOGGLE_MICROPHONE], onToggleMic);

  useEffect(() => {
    if(!isElectron || !ipcRenderer) return;
    ipcRenderer.on(ELECTRON_EVENTS.TOGGLE_MIC, onToggleMic);
    return () => {
      if(!isElectron || !ipcRenderer) return;
      ipcRenderer.off(ELECTRON_EVENTS.TOGGLE_MIC, onToggleMic)
    }
  }, [ipcRenderer, isElectron, onToggleMic])

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
