import { StationSocket } from '@/features/stations/components/station-socket';
import { Metadata } from 'next';
import { Fragment } from 'react';

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
      <StationSocket />
    </Fragment>
  );
};

export default WorkStationLayoutLayout;
