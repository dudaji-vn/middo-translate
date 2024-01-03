const formatTime = (time: number) => {
    if(!time) return '00:00';
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time - hours * 3600000) / 60000);
    const seconds = Math.floor((time - hours * 3600000 - minutes * 60000) / 1000);
    // Add 0 if less than 10
    if(hours > 0) {
        return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }
    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}
export default formatTime;