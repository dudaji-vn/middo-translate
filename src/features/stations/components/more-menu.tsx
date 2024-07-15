import { Button } from '@/components/actions';
import { MoreVerticalIcon } from 'lucide-react';
import { useStationActions } from './station-actions';
import { Station } from '../types/station.types';
import { cloneElement, useCallback, useMemo, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/auth.store';

export interface MoreMenuProps {
  station: Station;
}

export const MoreMenu = ({ station }: MoreMenuProps) => {
  const { actionItems, onAction } = useStationActions();
  const userId = useAuthStore((state) => state.user?._id);
  const { t } = useTranslation('common');
  const [isOpen, setOpen] = useState(false);
  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open);
  }, []);
  const items = useMemo(() => {
    return actionItems
      .filter((item) => {
        switch (item.action) {
          case 'leave':
            return station.owner._id !== userId;
          case 'delete':
            return station.owner._id === userId;
          default:
            return true;
        }
      })
      .map((item) => ({
        ...item,
        onAction: () =>
          onAction({
            action: item.action,
            station: station,
          }),
      }));
  }, [actionItems, onAction, station, userId]);
  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button.Icon
            size="xs"
            variant="ghost"
            color="default"
            className="absolute right-1 top-1"
          >
            <MoreVerticalIcon />
          </Button.Icon>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="dark:border-neutral-800 dark:bg-neutral-900">
          {items.map(({ renderItem, ...item }) => {
            if (renderItem) {
              return renderItem({ item, station, setOpen: onOpenChange });
            }
            return (
              <DropdownMenuItem
                className="flex items-center active:bg-primary-200 dark:hover:bg-neutral-800 dark:active:bg-neutral-700"
                key={item.action}
                disabled={item.disabled}
                onClick={item.onAction}
              >
                {cloneElement(item.icon, {
                  size: 16,
                  className: cn('mr-2', item.color && `text-${item.color}`),
                })}
                <span className={cn(item.color && `text-${item.color}`)}>
                  {t(item.label)}
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
