import React, { PropsWithChildren } from 'react';

import { InboxItemMenu } from './inbox-item.menu';
import { InboxItemMobileWrapper } from './inbox-item.wrapper.mobile';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { useAppStore } from '@/stores/app.store';
import { useInboxItem } from './inbox-item';

export interface InboxItemWrapperProps {}

export const InboxItemWrapper = (
  props: InboxItemWrapperProps & PropsWithChildren,
) => {
  const isMobile = useAppStore((state) => state.isMobile);

  const { data, isActive, onClick } = useInboxItem();

  const Wrapper = isMobile ? InboxItemMobileWrapper : React.Fragment;

  return (
    <div
      className={cn(
        'group relative flex cursor-pointer items-center justify-between px-3 py-2 transition-all',
        isActive ? 'bg-background-darker' : 'bg-transparent hover:bg-[#fafafa]',
      )}
    >
      <Wrapper>
        <Link
          onClick={onClick}
          href={data.link!}
          className="flex w-full items-center gap-3"
        >
          {props.children}
        </Link>

        {!isMobile && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
            <InboxItemMenu room={data} />
          </div>
        )}
      </Wrapper>
    </div>
  );
};
