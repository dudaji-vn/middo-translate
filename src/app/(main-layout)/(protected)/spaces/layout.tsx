import { FCMBackground } from '@/features/notification/components';
import { Fragment } from 'react';
import { Metadata } from 'next';
import BusinessSidebar from './[spaceId]/_components/business-sidebar/business-sidebar';

export const metadata: Metadata = {
  title: 'Business extension',
};
export interface BusinessLayoutProps {
  children: React.ReactNode;
}

const BusinessLayout = ({ children }: BusinessLayoutProps) => {
  return (
    <Fragment>
      <div className="flex flex-row">
        <BusinessSidebar />
        {children}
      </div>
      <FCMBackground />
    </Fragment>
  );
};

export default BusinessLayout;
