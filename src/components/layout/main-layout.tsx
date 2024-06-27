'use client';
import { usePlatformStore } from '@/features/platform/stores';
import { Header } from './header';
import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { useElectron } from '@/hooks/use-electron';
import { usePathname } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import VerificationHeader from './header/verification-header';
export interface MainLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MainLayout = forwardRef<HTMLDivElement, MainLayoutProps>(
  (props, ref) => {
    const isMobile = usePlatformStore((state) => state.platform === 'mobile');
    const pathname = usePathname();
    const isOnTheVerificationPage = pathname?.includes(
      ROUTE_NAMES.SPACE_VERIFY,
    );
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
        {!isMobile && !isOnTheVerificationPage && <Header />}
        {isOnTheVerificationPage && <VerificationHeader />}
        <div className="container-height overflow-y-auto">{props.children}</div>
      </div>
    );
  },
);
MainLayout.displayName = 'MainLayout';
