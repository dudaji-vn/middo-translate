import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/data-display';

import { Switch } from '@/components/data-entry';
import { cn } from '@/utils/cn';
import { forwardRef } from 'react';
import { stopPropagation } from '@/utils/stop-propagation';
import { useChatStore } from '../stores';
import { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';
import { useTranslation } from 'react-i18next';

export interface ChatSettingProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const ChatSettingMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ children, ...props }, ref) => {
    const {
      showTranslateOnType,
      toggleShowTranslateOnType,
      showMiddleTranslation,
      toggleShowMiddleTranslation,
    } = useChatStore();
    const { t } = useTranslation('common');
    return (
      <DropdownMenu dir={'ltr'} {...props}>
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
            <span className="text-sm">{t('CONVERSATION.TRANSLATED_TOOL')}</span>
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
            <span className="text-sm">
              {t('CONVERSATION.MESSAGE_TRANSLATE')}
            </span>
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
