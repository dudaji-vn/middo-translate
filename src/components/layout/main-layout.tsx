'use client';
import { usePlatformStore } from '@/features/platform/stores';
import { Header } from './header';
import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { useElectron } from '@/hooks/use-electron';
export interface MainLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MainLayout = forwardRef<HTMLDivElement, MainLayoutProps>(
  (props, ref) => {
    const isMobile = usePlatformStore((state) => state.platform === 'mobile');
    const { isElectron } = useElectron();
    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto',
          isMobile ? 'platform-mobile' : '',
          isElectron ? 'platform-electron' : '',
        )}
      >
        {!isMobile && <Header />}
        <div className="container-height overflow-y-auto">{props.children}</div>
      </div>
    );
  },
);
MainLayout.displayName = 'MainLayout';
