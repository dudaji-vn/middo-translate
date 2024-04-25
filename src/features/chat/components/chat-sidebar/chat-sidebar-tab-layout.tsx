import { Button } from '@/components/actions';
import { Sideslip } from '@/components/animations';
import { Typography } from '@/components/data-display';
import { ArrowLeftIcon } from 'lucide-react';
import { forwardRef } from 'react';
import { useSideChatStore } from '../../stores/side-chat.store';
export interface TabLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const TabLayout = forwardRef<HTMLDivElement, TabLayoutProps>(
  ({ children, title, ...props }, ref) => {
    const { setCurrentSide } = useSideChatStore();
    return (
      <Sideslip
        ref={ref}
        {...props}
        className="absolute left-0 top-0 flex h-main-container-height w-full flex-1 flex-col  bg-white"
      >
        <div className="flex items-center gap-2 px-1 pt-1">
          <Button.Icon
            onClick={() => setCurrentSide('')}
            variant="ghost"
            color="default"
            size="xs"
          >
            <ArrowLeftIcon />
          </Button.Icon>
          <Typography variant="default" className="font-semibold">
            {title}
          </Typography>
        </div>
        {children}
      </Sideslip>
    );
  },
);
TabLayout.displayName = 'TabLayout';
