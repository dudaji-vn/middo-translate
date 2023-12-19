import { AttachOutline, Camera, PlusCircle } from '@easy-eva-icons/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/data-display/popover';

import { Button } from '@/components/actions';

export interface AdditionalActionsProps {
  onOpenSelectFiles: () => void;
}

export const AdditionalActions = ({
  onOpenSelectFiles,
}: AdditionalActionsProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button.Icon size="sm" variant="ghost">
          <PlusCircle />
        </Button.Icon>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="w-fit p-2"
        align="start"
        sideOffset={16}
        alignOffset={-8}
      >
        <Button.Icon disabled size="sm" color="default" variant="ghost">
          <Camera />
        </Button.Icon>
        <Button.Icon
          color="default"
          onClick={onOpenSelectFiles}
          size="sm"
          variant="ghost"
        >
          <AttachOutline />
        </Button.Icon>
      </PopoverContent>
    </Popover>
  );
};
