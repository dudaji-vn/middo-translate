export const STREAM_CONFIG = {
    video: {
        facingMode: 'user',
        frameRate: { ideal: 10, max: 15 },
    },
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
    }
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