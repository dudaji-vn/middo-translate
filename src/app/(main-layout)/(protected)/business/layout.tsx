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
export interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  const headersList = headers();
  const fullUrl = headersList.get('referer') || "";
  const isBussinessSpace = fullUrl.endsWith(ROUTE_NAMES.BUSINESS_SPACE);

  return (
    <Fragment>
      <div className="flex flex-row">
        <div className={cn("w-[74px] max-md:hidden",)}>
          <BusinessSidebar />
        </div>
        {children}
      </div>
      <FCMBackground />
    </Fragment>
  );
};

export default ChatLayout;
