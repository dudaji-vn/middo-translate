'use client';
import { usePlatformStore } from '@/features/platform/stores';
import { Header } from './header';
import { forwardRef } from 'react';
export interface MainLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MainLayout = forwardRef<HTMLDivElement, MainLayoutProps>(
  (props, ref) => {
    const isMobile = usePlatformStore((state) => state.platform === 'mobile');
    return (
      <div ref={ref} className="mx-auto">
        <Header />
        <div className={!isMobile ? 'pt-[52px]' : ''}>{props.children}</div>
      </div>
    );
  },
);
MainLayout.displayName = 'MainLayout';
