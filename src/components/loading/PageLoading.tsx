import { SvgSpinnersGooeyBalls2 } from '../icons';

export const PageLoading = ()=> {
    return (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center gap-2 bg-black/80">
        <SvgSpinnersGooeyBalls2 className="h-[100px] w-[100px] text-background" />
        </div>
    );
}
