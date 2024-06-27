import { Circle } from 'lucide-react';
import React from 'react';

const Ping = ({
  hasNotification = true,
  size = 16,
  ...props
}: {
  hasNotification?: boolean;
  size?: number;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="absolute -top-1 right-[10px]" {...props}>
      <Circle
        size={size}
        className={
          hasNotification
            ? 'absolute inset-0 animate-ping fill-primary-500-main stroke-primary-500-main'
            : 'invisible'
        }
      />
      <Circle
        size={size}
        className={
          hasNotification
            ? 'absolute inset-0 fill-primary-500-main stroke-primary-500-main'
            : 'invisible'
        }
      />
    </div>
  );
};

export default Ping;
