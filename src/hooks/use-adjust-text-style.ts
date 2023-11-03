import { TEXT_THRESHOLD_ADJUST } from '@/configs/common';

export const useAdjustTextStyle = (
  text: string,
  threshold?: number,
  defaultStyle?: string,
  adjustStyle?: string,
) => {
  threshold = threshold || TEXT_THRESHOLD_ADJUST;
  adjustStyle = adjustStyle || 'text-[16px] font-normal';
  defaultStyle = defaultStyle || 'text-[22px] font-medium';
  const isAdjustStyle = text.length > threshold;
  return isAdjustStyle ? adjustStyle : defaultStyle;
};
