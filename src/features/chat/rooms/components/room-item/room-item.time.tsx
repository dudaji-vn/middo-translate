import { forwardRef, useMemo } from 'react';

import moment from 'moment';

export interface RoomItemTimeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  date?: string;
}

export const RoomItemTime = forwardRef<HTMLDivElement, RoomItemTimeProps>(
  ({ date }) => {
    const time = useMemo(() => {
      if (date) {
        if (moment(date).isSame(moment(), 'day')) {
          return moment(date).format('HH:mm A');
        } else {
          return moment(date).format('YYYY/MM/DD');
        }
      }

      return '';
    }, [date]);
    return (
      <span className="ml-auto shrink-0 pl-2 text-sm font-light">{time}</span>
    );
  },
);
RoomItemTime.displayName = 'RoomItemTime';
