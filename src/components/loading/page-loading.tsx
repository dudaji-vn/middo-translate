import { SvgSpinnersGooeyBalls2 } from '../icons';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

export const PageLoading = () => {
  useEffect(() => {
    let evenClick = (e: any) => {
      e.stopPropagation();
      e.preventDefault();
    };
    document.addEventListener('click', evenClick);
    return () => {
      document.removeEventListener('click', evenClick);
    };
  }, []);
  return createPortal(
    <div className="fixed inset-0 z-[999999] flex cursor-pointer items-center justify-center bg-black/80">
      <SvgSpinnersGooeyBalls2 className="h-[100px] w-[100px] text-background" />
    </div>,
    document.body,
  );
};
