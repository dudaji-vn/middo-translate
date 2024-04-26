import { Header } from './header';
import { forwardRef } from 'react';
export interface MainLayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MainLayout = forwardRef<HTMLDivElement, MainLayoutProps>(
  (props, ref) => {
    return (
      <div ref={ref} className="mx-auto">
        <Header />
        <div className='pt-[52px]'>
          {props.children}
        </div>
      </div>
    );
  },
);
MainLayout.displayName = 'MainLayout';
