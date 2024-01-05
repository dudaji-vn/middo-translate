import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/actions';
import { Sideslip } from '@/components/animations';
import { Typography } from '@/components/data-display';
import { forwardRef } from 'react';
import { useSidebarTabs } from '../../hooks';
export interface TabLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const TabLayout = forwardRef<HTMLDivElement, TabLayoutProps>(
  ({ children, title, ...props }, ref) => {
    const { changeToDefault } = useSidebarTabs();
    return (
      <Sideslip
        ref={ref}
        {...props}
        className="absolute left-0 top-0 flex h-full w-full flex-1 flex-col  bg-white"
      >
        <div className="flex items-center gap-2 px-1 pt-1">
          <Button.Icon
            onClick={changeToDefault}
            variant="ghost"
            color="default"
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
