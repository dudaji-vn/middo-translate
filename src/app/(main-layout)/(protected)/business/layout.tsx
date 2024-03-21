import { FCMBackground } from '@/features/notification/components';
import { Fragment } from 'react';
import { Metadata } from 'next';
import BusinessSidebar from './_components/business-sidebar/business-sidebar';
export const metadata: Metadata = {
  title: 'Business extension',
};
export interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <Fragment>
      <div className="flex flex-row">
        <div className="w-[74px] max-md:hidden">
          <BusinessSidebar />
        </div>
        {children}
      </div>
      <FCMBackground />
    </Fragment>
  );
};

export default ChatLayout;
