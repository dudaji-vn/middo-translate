'use client';

import './style.css';

import { usePathname, useRouter } from 'next/navigation';

import { ArrowLeftIcon } from 'lucide-react';
import { forwardRef } from 'react';
import { Button } from '../actions';

export interface BackLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  onBack?: () => void;
  title?: string;
}

export const BackLayout = forwardRef<HTMLDivElement, BackLayoutProps>(
  ({ onBack, title, ...props }, ref) => {
    const pathName = usePathname();
    const router = useRouter();
    return (
      <div
        ref={ref}
        {...props}
        className="bodyContainer mx-auto flex flex-col justify-center"
      >
        <div className="pageNavigationBar">
          <Button.Icon
            size="xs"
            color="default"
            onClick={
              onBack ||
              (() => {
                if (pathName === '/') return;
                router.back();
              })
            }
            className="absolute left-[5vw]"
          >
            <ArrowLeftIcon />
          </Button.Icon>
          <p className="font-semibold capitalize text-primary">{title}</p>
        </div>
        <div className="flex-1 overflow-hidden px-[5vw]">{props.children}</div>
      </div>
    );
  },
);
BackLayout.displayName = 'BackLayout';
