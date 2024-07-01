import { FCMBackground } from '@/features/notification/components';
import { Fragment } from 'react';
import { Metadata } from 'next';
import { StationSocket } from '@/features/stations/components/station-socket';

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
      <StationSocket />
    </Fragment>
  );
};

export default WorkStationLayoutLayout;
