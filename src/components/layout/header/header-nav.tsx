'use client';

import { HeaderNavMobile } from './header-nav.mobile';
import { NavItem } from './nav-item';
import { forwardRef } from 'react';
import { navItems } from './header.config';
import { useAppStore } from '@/stores/app.store';
import { usePathname } from 'next/navigation';
import { ROUTE_NAMES } from '@/configs/route-name';
import { cn } from '@/utils/cn';

export interface HeaderNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export const HeaderNav = forwardRef<HTMLDivElement, HeaderNavProps>(
  (props, ref) => {
    const pathName = usePathname();
    const isCurrentPath = (href: string) =>
      href == ROUTE_NAMES.ROOT
        ? pathName === ROUTE_NAMES.ROOT
        : pathName?.includes(href);

    return (
      <div {...props} className={cn("flex-1", props.className)}>
          <div className="md:flex w-screen flex-row items-stretch md:gap-1 lg:gap-5 bg-background shadow-none md:!ml-0 md:w-auto md:items-center justify-center hidden">
            {navItems.map((item) => (
              <NavItem
                isActive={isCurrentPath(item.href)}
                key={item.name}
                item={item}
              />
            ))}
          </div>
      </div>
    );
  },
);
HeaderNav.displayName = 'HeaderNav';
