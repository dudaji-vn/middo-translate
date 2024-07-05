import { AnimatePresence, motion } from 'framer-motion';
import { BarChartIcon, Menu, XIcon } from 'lucide-react';

import { Button } from '@/components/actions';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { forwardRef } from 'react';
import { navItems } from './header.config';
import { useBoolean } from 'usehooks-ts';
import { useDisableScrollWhenMount } from '@/hooks/use-disable-scroll-when-mount';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useElectron } from '@/hooks/use-electron';

export interface HeaderNavMobileProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const HeaderNavMobile = forwardRef<HTMLDivElement, HeaderNavMobileProps>(
  (props, ref) => {
    const { toggle, value } = useBoolean(false);
    const pathName = usePathname();
    
    return (
      <div className="md:hidden">
        <Button.Icon onClick={toggle} color="primary" variant="ghost" size="sm">
          {value ? <XIcon /> : <Menu />}
        </Button.Icon>
        <AnimatePresence>
          {value && <MobileNav toggleMenu={toggle} pathName={pathName} />}
        </AnimatePresence>
      </div>
    );
  },
);
HeaderNavMobile.displayName = 'HeaderNavMobile';
const MobileNav = ({
  pathName,
  toggleMenu,
}: {
  toggleMenu: () => void;
  pathName: string | null;
}) => {
  const {t} = useTranslation('common');
  const { isElectron } = useElectron();
  useDisableScrollWhenMount();
  return (
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
          'absolute left-0 top-[52px] z-50 flex w-full flex-col items-stretch overflow-hidden rounded-b-2xl  bg-background shadow-1 md:hidden',
        )}
      >
        {navItems.map((item, index) => {
          return (
            <motion.div
              onClick={toggleMenu}
              className={cn(
                'bg-background font-semibold active:bg-background-darker active:!text-shading md:!p-0 md:hover:text-secondary md:active:!bg-transparent dark:bg-neutral-900',
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
                className="block h-full w-full px-[5vw] py-4"
                href={item.href}
              >
                {t(item.name)}
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
  );
};
