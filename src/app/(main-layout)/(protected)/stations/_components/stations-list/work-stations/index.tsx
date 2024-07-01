import { Typography } from '@/components/data-display';
import { Card } from '@/components/ui/card';
import { ROUTE_NAMES } from '@/configs/route-name';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/utils/cn';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteStationModal } from '../../../station-crud/station-deletion/delete-station-modal';
import { SetStationToDefaultModal } from '../../../station-crud/station-designation';
import StationsListSkeletons from '../../skeletons/station-list-skeletons';
import { TStation } from '../../type';
import Station, { EStationActions } from '../station-card/station';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeDefault } from '@/services/station.service';
import customToast from '@/utils/custom-toast';

function StationCreateButton({}: {} & React.HTMLAttributes<HTMLDivElement>) {
  const { t } = useTranslation('common');
  const router = useRouter();
  return (
    <Card
      className={cn(
        'relative flex min-h-[112px] min-w-[280px] max-w-full cursor-pointer items-center justify-center  space-y-3 rounded-[12px] border border-dashed   border-primary-500-main p-3 transition-all duration-300 ease-in-out active:!bg-neutral-100 dark:active:!bg-neutral-800 md:hover:bg-neutral-50 dark:md:hover:bg-neutral-900',
      )}
      onClick={() => {
        router.push(`${ROUTE_NAMES.STATIONS}?modal=create-station`);
      }}
    >
      <Typography className="m-auto flex flex-row gap-2 text-primary">
        <Plus size={20} />
        Add Work Station
      </Typography>
    </Card>
  );
}

const WorkStations = ({
  loading = false,
  stations = [],
}: {
  stations: TStation[];
  loading?: boolean;
}) => {
  const currentUser = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const [modalAction, setModalAction] = React.useState<{
    action: EStationActions | null;
    station: TStation | null;
  }>({
    action: null,
    station: null,
  });
  const { mutate } = useMutation({
    mutationFn: removeDefault,
    onSuccess: () => {
      customToast.success(`Station is removed as default`);
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });
  const onAction = useCallback((action: EStationActions, station: TStation) => {
    if (action === EStationActions.REMOVE_DEFAULT) {
      mutate(station._id);
      return;
    }
    setModalAction({ action, station });
  }, []);

  const onCloseModal = useCallback(() => {
    setModalAction({ action: null, station: null });
  }, []);
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      <StationCreateButton />
      {loading && <StationsListSkeletons count={3} />}
      {stations?.map((stn, index) => {
        const isDefault = currentUser?.defaultStation?._id === stn._id;
        return (
          <Station
            isDefault={isDefault}
            key={stn._id}
            data={stn}
            menuProps={{
              onAction: (action) => onAction(action, stn),
            }}
          />
        );
      })}
      {modalAction.station && (
        <>
          <DeleteStationModal
            station={modalAction.station}
            open={modalAction.action === EStationActions.DELETE}
            onclose={onCloseModal}
          />
          <SetStationToDefaultModal
            onclose={onCloseModal}
            open={modalAction.action === EStationActions.SET_AS_DEFAULT}
            station={modalAction.station}
          />
        </>
      )}
    </div>
  );
};

export default WorkStations;
