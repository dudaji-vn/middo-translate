import { createPortal } from 'react-dom';
import { SvgSpinnersGooeyBalls2 } from '../icons';

export const PageLoading = ()=> {
    return (
        createPortal(
        <div className="fixed left-0 top-0 bottom-0 right-0 z-[999] bg-black/80">
            <div className='w-full h-full flex items-center justify-center'>
                <SvgSpinnersGooeyBalls2 className="h-[100px] w-[100px] text-background" />
            </div>
        </div>, document.body)
    );
}
