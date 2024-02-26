export default function processingStream(stream: MediaStream): MediaStream {
    const audioContext = new AudioContext();
    const modifiedAudioTracks: MediaStreamTrack[] = [];

    stream.getAudioTracks().forEach(track => {
        const audioSource = audioContext.createMediaStreamSource(new MediaStream([track]));
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.5;

        audioSource.connect(gainNode);

        const audioDestination = audioContext.createMediaStreamDestination();
        gainNode.connect(audioDestination);
        //createLoopbackConnection
        const loopback = audioContext.createMediaStreamDestination();

        const modifiedAudioTrack = audioDestination.stream.getAudioTracks()[0];
        modifiedAudioTracks.push(modifiedAudioTrack);
    });

    const modifiedStream = new MediaStream(modifiedAudioTracks.concat(stream.getVideoTracks()));

    return modifiedStream;
}


// export default function processingStream(stream: MediaStream): MediaStream {
//     const audioContext = new AudioContext();
//     const modifiedAudioTracks: MediaStreamTrack[] = [];

//     stream.getAudioTracks().forEach(track => {
//         const audioSource = audioContext.createMediaStreamSource(new MediaStream([track]));
//         const gainNode = audioContext.createGain();
//         // const filterNode = audioContext.createBiquadFilter();

//         // Apply some filtering to improve audio quality and reduce echo
//         // filterNode.type = 'lowpass'; // Apply a lowpass filter to remove high-frequency noise
//         // filterNode.frequency.value = 5000; // Adjust the cutoff frequency as needed
//         // filterNode.Q.value = 1; // Set the quality factor for the filter

//         // Adjust gain to a reasonable level
//         gainNode.gain.value = 0.5; // Adjust the gain value as needed, 0.8 is a starting point

//         // Connect the nodes: audio source -> filter -> gain -> destination
//         // audioSource.connect(filterNode);
//         // filterNode.connect(gainNode);
//         gainNode.connect(audioContext.destination);

//         // Create a new MediaStreamTrack with the modified audio
//         const audioDestination = audioContext.createMediaStreamDestination();
//         gainNode.connect(audioDestination);
//         const modifiedAudioTrack = audioDestination.stream.getAudioTracks()[0];
//         modifiedAudioTracks.push(modifiedAudioTrack);
//     });

//     // Create a new MediaStream with modified audio tracks and original video tracks
//     const modifiedStream = new MediaStream(modifiedAudioTracks.concat(stream.getVideoTracks()));

//     return modifiedStream;
// }
