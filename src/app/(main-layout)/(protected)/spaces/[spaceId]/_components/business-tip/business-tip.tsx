'use client'

import Tip from '@/components/data-display/tip/tip';
import React from 'react';

const tipContent = `Middo Conversation Extension is a free translated chat widget that you can install on your website. When people visit your website and click the Conversation button, they’ll be taken immediately into Middo Conversation to start a connection with your account as a guest user or as a Middo’s user`;

const BusinessTip = ({ ...props }: React.HTMLAttributes<HTMLDivElement> & {
}) => {
  const [hideTip, setHideTip] = React.useState(false);
  const showTip = () => {
    setHideTip(false);
  }
  const closeTip = () => {
    setHideTip(true);
  }

  return (
    <Tip {...props} hideTip={hideTip} closeTip={closeTip} tipTitle="Welcome to phrases" tipContent={tipContent} className='p-0' />
  );
};

export default BusinessTip;
