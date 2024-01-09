import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/data-display';

import { Button } from '@/components/actions';
import { Settings } from 'lucide-react';
import { Switch } from '@/components/data-entry';
import { cn } from '@/utils/cn';
import { forwardRef } from 'react';
import { stopPropagation } from '@/utils/stop-propagation';
import { useChatStore } from '../store';

export interface ChatSettingProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const ChatSettingMenu = forwardRef<HTMLDivElement, ChatSettingProps>(
  ({ children, ...props }, ref) => {
    const {
      showTranslateOnType,
      toggleShowTranslateOnType,
      showMiddleTranslation,
      toggleShowMiddleTranslation,
    } = useChatStore();
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="overflow-hidden rounded-2xl border bg-background p-0 shadow-3"
        >
          <div
            className={cn(
              'flex items-center justify-between gap-5 bg-background p-3',
            )}
          >
            <span className="text-sm">Translate tool</span>
            <Switch
              onClick={stopPropagation}
              checked={showTranslateOnType}
              onCheckedChange={toggleShowTranslateOnType}
            />
          </div>
          <div
            className={cn(
              'flex items-center justify-between gap-5 bg-background p-3',
            )}
          >
            <span className="text-sm">Message translate</span>
            <Switch
              onClick={stopPropagation}
              checked={showMiddleTranslation}
              onCheckedChange={toggleShowMiddleTranslation}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);
ChatSettingMenu.displayName = 'ChatSetting';
