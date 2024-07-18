'use client';

import { Avatar } from '@/components/data-display';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Station } from '../types/station.types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

export default function StationInformationModal({
  station,
  onClosed,
}: {
  station: Station;
  onClosed?: () => void;
}) {
  const { t } = useTranslation('common');
  return (
    <Dialog
      defaultOpen={true}
      onOpenChange={(open) => {
        if (!open) {
          onClosed?.();
        }
      }}
    >
      <DialogContent className='overflow-hidden w-full'>
        <DialogTitle className="flex h-[48px] flex-row items-center justify-between py-4 pr-2 text-2xl font-semibold tracking-tight">
          {t('COMMON.STATION_INFORMATION')}
        </DialogTitle>
        <div className="flex items-center gap-3">
          <Avatar
            alt={station.name}
            src={station.avatar!}
            size="3xl"
            className="border"
          />
          <div className="flex h-full flex-col justify-between whitespace-nowrap">
            <p className=" text-neutral-500">{t('COMMON.NAME')}:</p>
            <p className=" text-neutral-500">{t('COMMON.CREATED_BY')}:</p>
            <p className=" text-neutral-500">{t('COMMON.TIME.CREATED_ON')}:</p>
          </div>
          <div className="flex h-full flex-col justify-between ">
            <p className="font-semibold text-neutral-800">{station.name}</p>
            <div className="flex gap-1">
              <Avatar
                alt={station.owner?.name}
                src={station.owner?.avatar}
                size="xs"
              />
              <span className="font-semibold text-neutral-800 truncate">
                {station.owner?.name}
              </span>
            </div>
            <p className="font-semibold text-neutral-800">
              {moment(station.createdAt).format('DD/MM/YYYY')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
