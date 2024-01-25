import { Button } from '@/components/actions';
import { XIcon } from 'lucide-react';
import { cloneElement, forwardRef, isValidElement } from 'react';
export interface RoomSideTabLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  children: React.ReactNode;
  onBack: () => void;
  title?: string;
}

export const RoomSideTabLayout = forwardRef<
  HTMLDivElement,
  RoomSideTabLayoutProps
>(({ icon, title, children, onBack }, ref) => {
  const isIconValid = isValidElement(icon);
  return (
    <div className="-m-3 my-0 flex h-full flex-col">
      <div className="-mt-3 flex h-[53px] w-full items-center gap-2 border-b p-3 font-semibold text-primary">
        {isIconValid &&
          cloneElement(icon as React.ReactElement, {
            className: 'size-4',
          })}
        <span>{title}</span>
        <div className="ml-auto">
          <Button.Icon
            onClick={onBack}
            size="sm"
            variant="ghost"
            color="default"
          >
            <XIcon />
          </Button.Icon>
        </div>
      </div>
      {children}
    </div>
  );
});
RoomSideTabLayout.displayName = 'RoomSideTabLayout';
