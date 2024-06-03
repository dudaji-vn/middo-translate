import { Button } from '@/components/actions';
import { ChevronLeftIcon, XIcon } from 'lucide-react';
import { cloneElement, forwardRef, isValidElement } from 'react';
export interface RoomSideTabLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  children: React.ReactNode;
  onBack: () => void;
  title?: string;
  type?: 'back' | 'close';
}

export const RoomSideTabLayout = forwardRef<
  HTMLDivElement,
  RoomSideTabLayoutProps
>(({ icon, title, children, onBack, type = 'close' }, ref) => {
  const isIconValid = isValidElement(icon);
  return (
    <div className="-m-3 my-0 flex h-full flex-col">
      <div className="-mt-3 flex h-[53px] w-full items-center gap-2 border-b p-3 font-semibold text-primary">
        {type == 'back' && 
        <Button.Icon
          onClick={onBack}
          size="xs"
          variant="ghost"
          color="default"
        >
          <ChevronLeftIcon />
        </Button.Icon>}
        {isIconValid &&
          cloneElement(icon as React.ReactElement, {
            className: 'size-4',
          })}
        <span>{title}</span>
        {type == 'close' && 
          <div className="ml-auto">
            <Button.Icon
              onClick={onBack}
              size="xs"
              variant="ghost"
              color="default"
            >
              <XIcon />
            </Button.Icon>
          </div>
        }
      </div>
      {children}
    </div>
  );
});
RoomSideTabLayout.displayName = 'RoomSideTabLayout';
