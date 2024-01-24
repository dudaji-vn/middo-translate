export const STREAM_CONFIG = {
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
    },
    video: true,
    // audio: true,
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
    if (isTurnOnMic) {
        config = {
            ...config,
            audio: STREAM_CONFIG.audio
        }
    }
    return config
}