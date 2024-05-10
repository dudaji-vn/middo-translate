import { forwardRef, useMemo } from 'react';

import moment from 'moment';

export interface RoomItemTimeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  date?: string;
}

export const RoomItemTime = forwardRef<HTMLSpanElement, RoomItemTimeProps>(
  ({ date, ...props }, ref) => {
    const time = useMemo(() => {
      if (date) {
        if (moment(date).isSame(moment(), 'day')) {
          return moment(date).format('LT');
        } else {
          return moment(date).format('YYYY/MM/DD');
        }
      }

      return '';
    }, [date]);
    return (
      <span
        ref={ref}
        {...props}
        className="ml-auto shrink-0 pl-2 text-xs font-light text-neutral-300"
      >
        {time}
      </span>
    );
  },
);
RoomItemTime.displayName = 'RoomItemTime';
