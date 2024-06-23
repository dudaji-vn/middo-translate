import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonProps } from '@/components/actions';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import customToast from '@/utils/custom-toast';
import { TStation } from '../../_components/type';
import { useQueryClient } from '@tanstack/react-query';
import { GET_STATIONS_KEY } from '@/features/stations/hooks/use-get-spaces';
import { setDefaultStation } from '@/services/station.service';

export const SetStationToDefaultModal = ({
  station,
  open = false,
  onclose = () => {},
}: {
  station: Omit<TStation, 'owner'>;
  confirmBtnProps?: ButtonProps;
  open: boolean;
  onclose: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

  const onStationSetToDefault = async () => {
    if (!station._id) return;
    setLoading(true);
    try {
      await setDefaultStation(station._id)
        .then((res) => {
          if (res.data) {
            customToast.success(`Station ${station.name} is set as default`);
            queryClient.invalidateQueries([
              GET_STATIONS_KEY,
              { type: 'all_stations' },
            ]);
            return;
          }
        })
        .catch((err) => {
          customToast.error('Failed to set default station: ' + err);
        });
    } catch (error) {
      console.error('Error on setDefaultStation:', error);
      customToast.error('Error on confirm station. Please try again');
    }
    setLoading(false);
  };

  return (
    <>
      <ConfirmAlertModal
        title={`Delete station`}
        open={open}
        footerProps={{
          className: 'hidden',
        }}
      >
        <div className=" max-h-[calc(85vh-48px)] max-w-screen-md  bg-white dark:bg-background [&_h3]:mt-4  [&_h3]:text-[1.25rem]">
          <div className="flex w-full flex-col gap-3">
            <p
              className="text-left"
              dangerouslySetInnerHTML={{
                __html: t('MODAL.DELETE_STATION.DESCRIPTION', {
                  name: station.name,
                }),
              }}
            ></p>
            <div className="flex w-full flex-row items-center justify-end gap-3">
              <Button
                onClick={onclose}
                color={'default'}
                shape={'square'}
                size={'sm'}
              >
                {t('COMMON.CANCEL')}
              </Button>
              <Button
                type="button"
                color={'primary'}
                shape={'square'}
                size={'sm'}
                onClick={() => {
                  onStationSetToDefault();
                  onclose();
                }}
                loading={loading}
              >
                {t('COMMON.DELETE')}
              </Button>
            </div>
          </div>
        </div>
      </ConfirmAlertModal>
    </>
  );
};
