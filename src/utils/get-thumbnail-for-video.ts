async function getThumbnailForVideo(videoUrl: string, seek?: number, videoBlob?: Blob) {
  try {
    const video = document.createElement('video');
    video.style.display = 'none';
    const canvas = document.createElement('canvas');
    canvas.style.display = 'none';

    // Fetch the video content
    let _videoBlob;
    if (videoBlob) {
      _videoBlob = videoBlob;
    } else {
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }
      _videoBlob = await response.blob();
    }
    video.src = URL.createObjectURL(_videoBlob);

    // Trigger video load
    await new Promise((resolve, reject) => {
      video.addEventListener('loadedmetadata', () => {
        video.width = video.videoWidth;
        video.height = video.videoHeight;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // Seek the video to 25%
        video.currentTime = video.duration * (seek || 0.25);
      });
      video.addEventListener('seeked', () => resolve('loaded'));
    });

    // Draw the video frame to canvas
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const thumbnail = canvas.toDataURL('image/png');
    video.remove();
    canvas.remove();
    return thumbnail;

  } catch (error) {
    return '';
  }
}

export default getThumbnailForVideo;
