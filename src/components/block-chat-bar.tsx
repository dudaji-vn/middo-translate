import Link, { LinkProps } from 'next/link';
import React from 'react';
import { Button } from './actions';
import { cn } from '@/utils/cn';

const BlockChatBar = ({
  blockContent,
  learnMoreLink = '#',
  learnMoreText,
  linkProps,
  wrapperProps,
}: {
  blockContent: string;
  learnMoreLink: string;
  learnMoreText: string;
  linkProps?: LinkProps;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
}) => {
  return (
    <div
      {...wrapperProps}
      className={cn(
        'flex items-center justify-center bg-primary-100 py-1 text-neutral-800 dark:text-neutral-50 dark:bg-background max-md:flex-col max-md:text-center md:gap-2',
        wrapperProps?.className,
      )}
    >
      {blockContent}
      <Link
        // TODO: Add href to help-center here
        href={learnMoreLink}
        className={cn('cursor-pointer font-semibold text-primary')}
        {...linkProps}
      >
        <Button variant="ghost" color="primary" size={'xs'} shape={'square'}>
          {learnMoreText}
        </Button>
      </Link>
    </div>
  );
};

export default BlockChatBar;
