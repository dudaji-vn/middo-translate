import { createPortal } from 'react-dom';
import { SvgSpinnersGooeyBalls2 } from '../icons';
import { useEffect } from 'react';

export const PageLoading = ()=> {
    useEffect(() => {
        let evenClick = (e: any) => {
            e.stopPropagation();
            e.preventDefault();
        }
        document.addEventListener('click', evenClick);
        return () => {
            document.removeEventListener('click', evenClick);
        }
    }, [])
    return (
        createPortal(
        <div className="fixed inset-0 z-[999999] bg-black/80 flex items-center justify-center cursor-pointer">
            <SvgSpinnersGooeyBalls2 className="h-[100px] w-[100px] text-background" />
        </div>, document.body)
    );
}
