import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/feedback';

import { useTranslation } from 'react-i18next';
import { useLeaveStation } from '../hooks/use-leave-station';

export interface RoomLeaveProps {
  stationId: string;
  onClosed?: () => void;
}

export const StationLeaveModal = ({ stationId, onClosed }: RoomLeaveProps) => {
  const { mutate } = useLeaveStation();
  const { t } = useTranslation('common');
  return (
    <AlertDialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open && onClosed) {
          onClosed();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('MODAL.LEAVE_STATION.TITLE')}?</AlertDialogTitle>
          <AlertDialogDescription className="dark:text-neutral-50">
            {t('MODAL.LEAVE_STATION.DESCRIPTION')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="sm:mr-3">
            {t('COMMON.CANCEL')}
          </AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            className="bg-error text-background active:!bg-error-darker md:hover:bg-error-lighter"
            onClick={() => {
              mutate(stationId);
            }}
          >
            {t('COMMON.LEAVE')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
