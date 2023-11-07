import { Header } from './header';
import { forwardRef } from 'react';
export interface MainLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MainLayout = forwardRef<HTMLDivElement, MainLayoutProps>(
  (props, ref) => {
    return (
      <div ref={ref} className="full flex h-full flex-col pb-5">
        <Header />
        {props.children}
      </div>
    );
  },
);
MainLayout.displayName = 'MainLayout';
