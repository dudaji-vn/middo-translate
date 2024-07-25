'use client';

import { ROUTE_NAMES } from '@/configs/route-name';
import { useElectron } from '@/hooks/use-electron';
import { cn } from '@/utils/cn';
import { usePathname } from 'next/navigation';
import { forwardRef } from 'react';
import { navItems } from './header.config';
import { NavItem } from './nav-item';

export interface HeaderNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export const HeaderNav = forwardRef<HTMLDivElement, HeaderNavProps>(
  (props, ref) => {
    const pathName = usePathname();
    const { isElectron } = useElectron();
    const isCurrentPath = (href: string) =>
      href == ROUTE_NAMES.ROOT
        ? pathName === ROUTE_NAMES.ROOT
        : pathName?.includes(href);

    return (
      <div {...props} className={cn('z-0 block flex-1', props.className)}>
        <div className="hidden w-screen flex-row items-stretch justify-center shadow-none md:!ml-0 md:flex md:w-auto md:items-center md:gap-1 lg:gap-5">
          {navItems.map((item) => {
            const isActive = isCurrentPath(item.href);
            return <NavItem isActive={isActive} key={item.name} item={item} />;
          })}
        </div>
      </div>
    );
  },
);
HeaderNav.displayName = 'HeaderNav';
