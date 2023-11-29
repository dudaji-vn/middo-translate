'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { BarChartOutline, Close } from '@easy-eva-icons/react';
import { forwardRef, useState } from 'react';

import { Button } from '@/components/actions';
import Link from 'next/link';
import { ROUTE_NAMES } from '@/configs/route-name';
import { cn } from '@/utils/cn';
import useAuthStore from '@/features/auth/stores/use-auth-store';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { usePathname } from 'next/navigation';

type NavigationItem = {
  name: string;
  href: string;
};
const navigationItems: NavigationItem[] = [
  {
    name: 'Translation',
    href: ROUTE_NAMES.ROOT,
  },
  {
    name: 'Conversation',
    href: ROUTE_NAMES.ONLINE_CONVERSATION,
  },
  {
    name: 'Duel',
    href: '#',
  },
];

export interface HeaderNavigationProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const HeaderNavigation = forwardRef<
  HTMLDivElement,
  HeaderNavigationProps
>((props, ref) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const pathName = usePathname();

  return (
    <div className="flex-1">
      <Button.Icon
        onClick={toggleMenu}
        className="md:hidden"
        color="secondary"
        shape="square"
      >
        {isMenuOpen ? <Close /> : <BarChartOutline className="rotate-90" />}
      </Button.Icon>

      {!isMobile && (
        <div className="flex w-screen flex-row items-stretch gap-[60px] bg-background shadow-none md:!ml-0 md:w-auto md:items-center">
          {navigationItems.map((item) => (
            <NavigationItem
              isActive={pathName === item.href}
              key={item.name}
              item={item}
            />
          ))}
        </div>
      )}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: {
                  ease: 'easeInOut',
                  duration: 0.3,
                  delay: 0.1,
                },
              }}
              className={cn(
                'absolute left-0 top-[90px] z-50 flex w-full flex-col items-stretch  bg-background shadow-1',
              )}
            >
              {navigationItems.map((item, index) => {
                return (
                  <motion.div
                    className={cn(
                      'bg-background font-semibold active:bg-background-darker active:!text-shading md:!p-0 md:hover:text-secondary md:active:!bg-transparent',
                      pathName === item.href && '!bg-lighter text-primary',
                    )}
                    key={item.name}
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: (index + 1) * 0.1 }}
                    exit={{
                      opacity: 0,
                      x: -80,
                      transition: {
                        ease: 'easeInOut',
                        delay: 0.1,
                      },
                    }}
                  >
                    <Link
                      className="block h-full w-full px-[5vw] py-4 "
                      href={item.href}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              exit={{
                opacity: 0,
                transition: {
                  ease: 'easeInOut',
                  duration: 0.3,
                  delay: 0.1,
                },
              }}
              onClick={toggleMenu}
              className="absolute bottom-0 left-0 right-0 top-[90px] z-20 h-[calc(100%_-_90px)] w-full bg-black/70"
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
});
HeaderNavigation.displayName = 'HeaderNavigation';

const NavigationItem = ({
  item,
  isActive = false,
}: {
  item: {
    name: string;
    href: string;
  };
  isActive?: boolean;
}) => {
  return (
    <Link
      href={item.href}
      className={cn(
        'bg-background px-[5vw] py-4 font-semibold active:bg-background-darker active:!text-shading md:!p-0 md:hover:text-secondary md:active:!bg-transparent',
        isActive && '!text-primary',
      )}
    >
      {item.name}
    </Link>
  );
};
