import { useWindowSize } from 'usehooks-ts';
const MAX_MOBILE_WIDTH = 768;
export const useIsMobile = () => {
  const { width } = useWindowSize();
  return width < MAX_MOBILE_WIDTH;
};
