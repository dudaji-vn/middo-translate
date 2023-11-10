import { Header } from './header';
import { forwardRef } from 'react';
export interface MainLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MainLayout = forwardRef<HTMLDivElement, MainLayoutProps>(
  (props, ref) => {
    return (
      <div
        ref={ref}
        className="full mx-auto flex h-full min-h-screen max-w-[1440px] flex-col pb-10"
      >
        <Header />
        {props.children}
      </div>
    );
  },
);
MainLayout.displayName = 'MainLayout';
