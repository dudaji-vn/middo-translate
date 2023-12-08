import { createPortal } from 'react-dom';
import { SvgSpinnersGooeyBalls2 } from '../icons';

export const PageLoading = ()=> {
    return (
        createPortal(
        <div className="fixed inset-0 z-[999999] bg-black/80 flex items-center justify-center cursor-pointer">
            <SvgSpinnersGooeyBalls2 className="h-[100px] w-[100px] text-background" />
        </div>, document.body)
    );
}
