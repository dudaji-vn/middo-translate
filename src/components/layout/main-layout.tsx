import { Header } from './header';
import { forwardRef } from 'react';
export interface MainLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MainLayout = forwardRef<HTMLDivElement, MainLayoutProps>(
  (props, ref) => {
    return (
      <div ref={ref} className="full mx-auto flex h-full flex-col">
        <Header />
        <div className="">{props.children}</div>
      </div>
    );
  },
);
MainLayout.displayName = 'MainLayout';
