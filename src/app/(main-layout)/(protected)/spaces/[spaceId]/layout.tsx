import { FCMBackground } from '@/features/notification/components';
import { Fragment } from 'react';
import { Metadata } from 'next';
import BusinessSidebar from './_components/business-sidebar/business-sidebar';
import { headers } from 'next/headers';
import { cn } from '@/utils/cn';
import { ROUTE_NAMES } from '@/configs/route-name';
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
