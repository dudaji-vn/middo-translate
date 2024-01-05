import COLORS from '../constant/colors';
export default function getRandomColor(): string {
    const index = Math.floor(Math.random() * COLORS.length);
    return COLORS[index];
}