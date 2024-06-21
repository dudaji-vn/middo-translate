import { FCMBackground } from '@/features/notification/components';
import { Fragment } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Middo Work Station',
};
export interface WorkStationLayoutLayoutProps {
  children: React.ReactNode;
}

const WorkStationLayoutLayout = ({
  children,
}: WorkStationLayoutLayoutProps) => {
  return (
    <Fragment>
      {children}
      <FCMBackground />
    </Fragment>
  );
};

export default WorkStationLayoutLayout;
