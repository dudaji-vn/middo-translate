import { Header } from './header';
import { forwardRef } from 'react';
export interface MainLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MainLayout = forwardRef<HTMLDivElement, MainLayoutProps>(
  (props, ref) => {
    return (
      <div className="flex h-screen w-screen flex-col">
        <Header />
        {props.children}
      </div>
    );
  },
);
MainLayout.displayName = 'MainLayout';
