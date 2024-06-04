interface Parameter {
    isTurnOnCamera: boolean;
    isTurnOnMic: boolean;
    cameraDeviceId?: string;
    micDeviceId?: string;
}
interface ConstraintsVideoInterface {
    audio: boolean;
    video: boolean | { deviceId: string };
}
interface ConstraintsAudioInterface {
    audio: {
        echoCancellation: boolean;
        noiseSuppression: boolean;
        deviceId?: string;
    }
}
export default async function getUserStream({isTurnOnCamera , isTurnOnMic, cameraDeviceId, micDeviceId} : Parameter) {
    try {
        const constraintsVideo : ConstraintsVideoInterface = {
            audio: false,
            video: true,
        }
        if(cameraDeviceId) {
            constraintsVideo.video = {
                deviceId: cameraDeviceId
            }
        }
        const constraintsAudio: ConstraintsAudioInterface = {
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
            }
        }
        if(micDeviceId) {
            constraintsAudio.audio.deviceId = micDeviceId
        }
        // create audio and video streams separately
        let videoStream: (MediaStream | undefined) = undefined;
        let audioStream: (MediaStream | undefined) = undefined;
        let combineArr: MediaStreamTrack[] = []
        if(isTurnOnCamera) {
            videoStream = await navigator.mediaDevices.getUserMedia(constraintsVideo)
            combineArr = [...videoStream.getVideoTracks()]
        }
        if(isTurnOnMic) {
            audioStream = await navigator.mediaDevices.getUserMedia(constraintsAudio)
            // const audioContext = new AudioContext();
            // const streamSource = audioContext.createMediaStreamSource(audioStream);
            // const gain = audioContext.createGain();
            // gain.gain.value = 0.5;
            // gain.connect(audioContext.destination);
            // streamSource.connect(gain);
            // const audioContext = new AudioContext()
            // const destinationNode = audioContext.createMediaStreamDestination();
            // audioContext.createMediaStreamSource(new MediaStream([audioStream.getAudioTracks()[0]]))
            //         .connect(createDistortion(audioContext))
            //         .connect(destinationNode);
            // const loopbackStream = await createLoopbackConnection(destinationNode);
            combineArr = [...combineArr, ...audioStream.getAudioTracks()]
        }
        const combinedStream = new MediaStream(combineArr)
        return combinedStream
    } catch (error) {
        throw(error)
    }
    
}