import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/actions';
import Link from 'next/link';
import { ROUTE_NAMES } from '@/configs/route-name';
import { forwardRef } from 'react';

export interface RoomBoxHeaderNavigationProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const RoomBoxHeaderNavigation = forwardRef<
  HTMLDivElement,
  RoomBoxHeaderNavigationProps
>((props, ref) => {
  return (
    <div ref={ref} {...props} className="md:hidden">
      <Link href={ROUTE_NAMES.ONLINE_CONVERSATION}>
        <Button.Icon size="md" variant="ghost" color="default">
          <ArrowLeft />
        </Button.Icon>
      </Link>
    </div>
  );
});
RoomBoxHeaderNavigation.displayName = 'RoomBoxHeaderNavigation';
