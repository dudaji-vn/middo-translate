
const RANDOM_RANGE = 16777215;

const generateRandomHexColor = () => {
    return `#${Math.floor(Math.random() * RANDOM_RANGE).toString(16)}`
}
const getContrastingTextColor = (hex: string) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}


export {
    generateRandomHexColor,
    getContrastingTextColor
}