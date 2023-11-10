import { useEffect, useRef, useState } from 'react';

import RecordPlugin from 'wavesurfer.js/plugins/record';
import WaveSurfer from 'wavesurfer.js';

export const useWaveForm = () => {
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const recordPluginRef = useRef<RecordPlugin | null>(null);
  const micSelectRef = useRef<HTMLSelectElement | null>(null);

  const [device, setDevice] = useState<any>(null);

  const [isRecording, setIsRecording] = useState(false);
  useEffect(() => {
    const initWaveSurfer = () => {
      const wavesurferInstance = WaveSurfer.create({
        container: '#mic',
        waveColor: '#3d87ed',
        barGap: 4,
        barWidth: 4,
        barHeight: 0.3,
      });
      wavesurferRef.current = wavesurferInstance;

      const recordPluginInstance = wavesurferInstance.registerPlugin(
        RecordPlugin.create(),
      );
      recordPluginRef.current = recordPluginInstance;

      // Mic selection
      RecordPlugin.getAvailableAudioDevices().then((devices) => {
        devices.forEach((device) => {
          if (device.deviceId === 'default') {
            setDevice(device);
            return;
          }
        });
      });
    };

    initWaveSurfer();
  }, []);

  const startWaveSurfer = () => {
    const { current: recordPlugin } = recordPluginRef;
    const deviceId = device?.deviceId;
    if (recordPlugin && deviceId) {
      recordPlugin.startRecording({ deviceId }).then(() => {
        setIsRecording(true);
      });
    }
  };

  const stopWaveSurfer = () => {
    const { current: recordPlugin } = recordPluginRef;
    if (recordPlugin) {
      recordPlugin.stopRecording();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    const mic = document.querySelector('#mic');
    const children = mic?.children;

    // remove first child
    if (children && children.length > 1) {
      mic?.removeChild(children[0]);
    }
  }, []);

  return {
    startWaveSurfer,
    stopWaveSurfer,
    isRecording,
    micSelectRef,
    wavesurferRef,
  };
};
