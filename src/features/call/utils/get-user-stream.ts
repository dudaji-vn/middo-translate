interface Parameter {
    isTurnOnCamera: boolean;
    isTurnOnMic: boolean
}
export default async function getUserStream({isTurnOnCamera , isTurnOnMic} : Parameter) {
    try {
        const constraintsVideo = {
            audio: false,
            video: true,
        }
        const constraintsAudio = {
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: false,
                sampleRate: 44100,
            }
        }
        // create audio and video streams separately
        let videoStream: (MediaStream | undefined) = undefined;
        let audioStream: (MediaStream | undefined) = undefined;
        let combineArr: any[] = []
        if(isTurnOnCamera) {
            videoStream = await navigator.mediaDevices.getUserMedia(constraintsVideo)
            combineArr = [...videoStream.getVideoTracks()]
        }
        if(isTurnOnMic) {
            audioStream = await navigator.mediaDevices.getUserMedia(constraintsAudio)
            combineArr = [...combineArr, ...audioStream.getAudioTracks()]
        }
        const combinedStream = new MediaStream(combineArr)
        return combinedStream
    } catch (error) {
        throw(error)
    }
    
}