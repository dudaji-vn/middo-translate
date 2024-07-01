'use client';

import Tip from '@/components/data-display/tip/tip';
import React from 'react';

const tipContent =
  'Middo Work Station is a place where you can manage your team and chat, call and share files with them.';

const StationTip = ({
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {}) => {
  const [hideTip, setHideTip] = React.useState(false);
  const showTip = () => {
    setHideTip(false);
  };
  const closeTip = () => {
    setHideTip(true);
  };

  return (
    <Tip
      {...props}
      hideTip={hideTip}
      closeTip={closeTip}
      tipTitle="Welcome to Middo Work Station"
      tipContent={tipContent}
      className="p-0"
    />
  );
};

export default StationTip;
