import customToast from "@/utils/custom-toast";
import { t } from "i18next";

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
const constraintsVideo : ConstraintsVideoInterface = {
    audio: false,
    video: true,
}
const constraintsAudio: ConstraintsAudioInterface = {
    audio: {
        echoCancellation: true,
        noiseSuppression: true,
    }
}
export type ResponseUserMedia = {
    stream?: MediaStream;
    isTurnOnCamera: boolean;
    isTurnOnMic: boolean;
}
export default async function getUserStream({isTurnOnCamera , isTurnOnMic, cameraDeviceId, micDeviceId} : Parameter) : Promise<ResponseUserMedia> {
    let isMicOn = false;
    let isCameraOn = false;
    
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
    const disallow : {video?: boolean, audio?: boolean} = {}
    try {
        if(isTurnOnCamera) {
            videoStream = await navigator.mediaDevices.getUserMedia(constraintsVideo)
            combineArr = [...videoStream.getVideoTracks()]
            isCameraOn = true
        }
    } catch (error) {
        isCameraOn = false
        disallow.video = true
    }
    try {
        if(isTurnOnMic) {
            audioStream = await navigator.mediaDevices.getUserMedia(constraintsAudio)
            combineArr = [...combineArr, ...audioStream.getAudioTracks()]
            isMicOn = true
        }
    } catch (error) {
        isMicOn = false
        disallow.audio = true
    }

    // Check to show error message
    if(Object.keys(disallow).length > 0) {
        if(disallow.video && disallow.audio) {
            customToast.error('Cannot access to your camera and microphone');
        } else {
            if(disallow.video) {
                customToast.error('Cannot access to your camera');
            }
            if(disallow.audio) {
                customToast.error('Cannot access to your microphone');
            }
        }
    }
    
    // if(isTurnOnMic) {
    //     audioStream = await navigator.mediaDevices.getUserMedia(constraintsAudio)
    //     // Handle Audio Echo
    //     // const audioContext = new AudioContext();
    //     // const streamSource = audioContext.createMediaStreamSource(audioStream);
    //     // const gain = audioContext.createGain();
    //     // gain.gain.value = 0.5;
    //     // gain.connect(audioContext.destination);
    //     // streamSource.connect(gain);
    //     // const audioContext = new AudioContext()
    //     // const destinationNode = audioContext.createMediaStreamDestination();
    //     // audioContext.createMediaStreamSource(new MediaStream([audioStream.getAudioTracks()[0]]))
    //     //         .connect(createDistortion(audioContext))
    //     //         .connect(destinationNode);
    //     // const loopbackStream = await createLoopbackConnection(destinationNode);
    //     combineArr = [...combineArr, ...audioStream.getAudioTracks()]
    // }
    if(combineArr.length === 0) {
        return {
            stream: undefined,
            isTurnOnCamera: false,
            isTurnOnMic: false
        }
    }
    const combinedStream = new MediaStream(combineArr)
    return {
        stream: combinedStream,
        isTurnOnCamera: isCameraOn,
        isTurnOnMic: isMicOn
    }
    
}