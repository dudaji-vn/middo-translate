export const STREAM_CONFIG = {
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false,
        sampleRate: 44100,
        advanced:
        [
           {googEchoCancellation: { exact: true }},
           {googExperimentalEchoCancellation: {exact: true}},
           {googAutoGainControl: {exact: true}},
           {googExperimentalAutoGainControl: {exact: true}},
           {googNoiseSuppression: {exact: true}},
           {googHighpassFilter: {exact: true}},
           {googAudioMirroring: {exact: false}},
           {googExperimentalNoiseSuppression: {exact: true}},
           {deviceId: {exact: ["default"]}}
        ]
    },
    video: true,
    // audio: true
}

export default function getStreamConfig(isTurnOnCamera: boolean, isTurnOnMic: boolean) {
    if(!isTurnOnCamera && !isTurnOnMic) throw new Error('At least one of camera or mic must be turn on')
    let config = {}
    if (isTurnOnCamera) {
        config = {
            ...config,
            video: STREAM_CONFIG.video
        }
    }
    if (isTurnOnMic || isTurnOnCamera) {
        config = {
            ...config,
            audio: STREAM_CONFIG.audio
        }
    }
    return config
}