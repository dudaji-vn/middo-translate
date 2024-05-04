import { useEffect, useState } from 'react';

export default function useGetAudioVideoSource() {
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>(
    [],
  );
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>(
    [],
  );
  const [audioOutputDevices, setAudioOutputDevices] = useState<
    MediaDeviceInfo[]
  >([]);
  useEffect(() => {
    const getAudioOutputDevice = async () => {
      const _audioInput = [];
      const _videoInput = [];
      const _audioOutput = [];
      const devices = await navigator.mediaDevices.enumerateDevices();
      for (const device of devices) {
        if(!device.deviceId) continue;
        switch (device.kind) {
          case 'audioinput':
            _audioInput.push(device);
            break;
          case 'videoinput':
            _videoInput.push(device);
            break;
          case 'audiooutput':
            _audioOutput.push(device);
            break;
          default:
            break;
        }
      }
      setAudioInputDevices(_audioInput);
      setVideoInputDevices(_videoInput);
      setAudioOutputDevices(_audioOutput);
    };

    getAudioOutputDevice();
  }, []);

  return { audioInputDevices, videoInputDevices, audioOutputDevices };
}
