'use client';

import './style.css';

import { usePathname, useRouter } from 'next/navigation';

import { ArrowBack } from '@easy-eva-icons/react';
import { forwardRef } from 'react';

export interface BackLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  onBack?: () => void;
  title?: string;
}

export const BackLayout = forwardRef<HTMLDivElement, BackLayoutProps>(
  ({ onBack, title, ...props }, ref) => {
    const pathName = usePathname();
    const router = useRouter();
    return (
      <div ref={ref} {...props} className="bodyContainer flex flex-col">
        <div className="pageNavigationBar">
          <button
            onClick={
              onBack ||
              (() => {
                if (pathName === '/') return;
                router.back();
              })
            }
            className="backButton active:bg-stroke md:hover:bg-background-darker"
          >
            <ArrowBack className="h-[30px] w-[30px]" />
          </button>
          <p className="pageTitle">{title}</p>
        </div>
        <div className="flex-1 overflow-hidden">{props.children}</div>
      </div>
    );
  },
);
BackLayout.displayName = 'BackLayout';
