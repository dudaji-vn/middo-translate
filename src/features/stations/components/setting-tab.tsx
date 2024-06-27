'use client';
import { Avatar, IconWrapper, Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { Users2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useGetStation } from '../hooks/use-get-station';
import { Station } from '../types/station.types';
import { MoreMenu } from './more-menu';
import { StationActions } from './station-actions';
import { StationAddMember } from './station-add-member';
import { StationLeave } from './station-leave';
import { StationMembers } from './station-members';

export interface SettingTabProps {}

export const SettingTab = (props: SettingTabProps) => {
  const { t } = useTranslation('common');
  const params = useParams<{ stationId: string }>();
  const { data } = useGetStation({ stationId: params?.stationId! });
  if (!data) return null;
  return (
    <StationActions>
      <div
        className={cn(
          'relative flex h-full w-full flex-1 flex-col overflow-hidden',
        )}
      >
        <StationCard station={data} />

        <StationMembers station={data} />

        <div className="mt-auto">
          <StationLeave roomId={data._id} />
        </div>
      </div>
    </StationActions>
  );
};

const StationCard = ({ station }: { station: Station }) => {
  return (
    <div className="p-3 pb-0">
      <div className="relative flex items-center gap-3 rounded-xl bg-primary-100 px-3 py-5">
        <Avatar size="3xl" alt={station.name} src={station.avatar!} />
        <Typography variant="h4">{station.name}</Typography>
        <MoreMenu station={station} />
      </div>
    </div>
  );
};
