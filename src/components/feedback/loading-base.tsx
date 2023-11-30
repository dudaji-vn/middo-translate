import { SvgSpinnersGooeyBalls2 } from '../icons';
import { forwardRef } from 'react';
interface LoadingBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  loadingText?: string;
}

export const LoadingBase = forwardRef<HTMLDivElement, LoadingBaseProps>(
  ({ loadingText, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className="fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center gap-2 bg-black/80"
      >
        <SvgSpinnersGooeyBalls2 className="h-[100px] w-[100px] text-background" />
        <span className="text-2xl text-background opacity-80">
          {loadingText || 'Loading...'}
        </span>
      </div>
    );
  },
);
LoadingBase.displayName = 'LoadingBase';
