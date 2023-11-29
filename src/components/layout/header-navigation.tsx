'use client';

import { BarChartOutline, Close } from '@easy-eva-icons/react';
import { forwardRef, useState } from 'react';

import { Button } from '@/components/actions';
import { cn } from '@/utils/cn';
import { useIsMobile } from '@/hooks/use-is-mobile';

export interface HeaderNavigationProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const HeaderNavigation = forwardRef<
  HTMLDivElement,
  HeaderNavigationProps
>((props, ref) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div className="md:flex-1">
      <Button.Icon
        onClick={toggleMenu}
        className="md:hidden"
        color="secondary"
        shape="square"
      >
        {isMenuOpen ? <Close /> : <BarChartOutline />}
      </Button.Icon>

      {!isMobile && (
        <div className="flex w-screen flex-row items-stretch gap-[60px] bg-background shadow-none md:!ml-0 md:w-auto md:items-center">
          <a
            href="#"
            className="active bg-background px-[5vw] py-4 font-semibold active:bg-background-darker active:!text-shading md:!p-0 md:hover:text-primary md:active:!bg-transparent"
          >
            Translation
          </a>
          <a
            href="#"
            className=" active bg-background px-[5vw] py-4 font-semibold active:bg-background-darker active:!text-shading md:!p-0 md:hover:text-primary md:active:!bg-transparent"
          >
            Conversation
          </a>
          <a
            href="#"
            className=" active bg-background px-[5vw] py-4 font-semibold active:bg-background-darker active:!text-shading md:!p-0 md:hover:text-primary md:active:!bg-transparent"
          >
            Duel
          </a>
        </div>
      )}
      {isMobile && (
        <>
          <div
            className={cn(
              'absolute left-0 top-[90px] z-50 flex w-full flex-col items-stretch bg-background shadow-1 transition-all',
              isMenuOpen ? '' : '-translate-x-full',
            )}
          >
            <a
              href="#"
              className="active bg-background px-[5vw] py-4 font-semibold active:bg-background-darker active:!text-shading md:!p-0 md:hover:text-primary md:active:!bg-transparent"
            >
              Translation
            </a>
            <a
              href="#"
              className=" active bg-background px-[5vw] py-4 font-semibold active:bg-background-darker active:!text-shading md:!p-0 md:hover:text-primary md:active:!bg-transparent"
            >
              Conversation
            </a>
            <a
              href="#"
              className="active bg-background px-[5vw] py-4 font-semibold active:bg-background-darker active:!text-shading md:!p-0 md:hover:text-primary md:active:!bg-transparent"
            >
              Duel
            </a>
          </div>
          <div
            onClick={toggleMenu}
            className="absolute bottom-0 left-0 right-0 top-[90px] z-20 h-[calc(100%_-_90px)] w-full bg-black/70"
          ></div>
        </>
      )}
    </div>
  );
});
HeaderNavigation.displayName = 'HeaderNavigation';
