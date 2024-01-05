'use client';

import { HeaderNavMobile } from './header-nav.mobile';
import { NavItem } from './nav-item';
import { forwardRef } from 'react';
import { navItems } from './header.config';
import { useAppStore } from '@/stores/app.store';
import { usePathname } from 'next/navigation';

export interface HeaderNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export const HeaderNav = forwardRef<HTMLDivElement, HeaderNavProps>(
  (props, ref) => {
    const isMobile = useAppStore((state) => state.isMobile);

    const pathName = usePathname();

    return (
      <div className="flex-1">
        {isMobile ? (
          <HeaderNavMobile />
        ) : (
          <div className="flex w-screen flex-row items-stretch gap-[60px] bg-background shadow-none md:!ml-0 md:w-auto md:items-center">
            {navItems.map((item) => (
              <NavItem
                isActive={pathName === item.href}
                key={item.name}
                item={item}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);
HeaderNav.displayName = 'HeaderNav';
