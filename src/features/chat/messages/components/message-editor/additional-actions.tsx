import { CameraIcon, PaperclipIcon, PlusCircleIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';

import { Button } from '@/components/actions';

export interface AdditionalActionsProps {
  onOpenSelectFiles: () => void;
}

export const AdditionalActions = ({
  onOpenSelectFiles,
}: AdditionalActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button.Icon tabIndex={-1} size="sm" variant="ghost">
          <PlusCircleIcon />
        </Button.Icon>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        className="flex w-fit min-w-min p-2"
        align="start"
        sideOffset={16}
        alignOffset={-8}
      >
        <DropdownMenuItem asChild>
          <Button.Icon
            disabled
            size="sm"
            color="default"
            variant="ghost"
            shape="default"
            className="rounded-full"
          >
            <CameraIcon />
          </Button.Icon>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button.Icon
            color="default"
            onClick={onOpenSelectFiles}
            size="sm"
            variant="ghost"
            shape="default"
            className="rounded-full"
          >
            <PaperclipIcon />
          </Button.Icon>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
