import { useTranslation } from 'react-i18next';
import { Button, ButtonProps } from '@/components/actions';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import customToast from '@/utils/custom-toast';
import { TStation } from '../../_components/type';

import { setDefaultStation } from '@/services/station.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');
  const { isLoading, mutateAsync } = useMutation({
    mutationFn: setDefaultStation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });

  return (
    <>
      <ConfirmAlertModal
        title={t('MODAL.SET_AS_DEFAULT_STATION.TITLE')}
        open={open}
        footerProps={{
          className: 'hidden',
        }}
      >
        <div className=" max-h-[calc(85vh-48px)] max-w-screen-md  bg-white dark:bg-background [&_h3]:mt-4  [&_h3]:text-[1.25rem]">
          <div className="flex w-full flex-col gap-5">
            <p
              className="text-left"
              dangerouslySetInnerHTML={{
                __html: t('MODAL.SET_AS_DEFAULT_STATION.DESCRIPTION', {
                  name: station.name,
                }),
              }}
            ></p>
            <div className="mt flex w-full flex-row items-center justify-end gap-5">
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
                onClick={async () => {
                  await mutateAsync(station._id);
                  onclose();
                }}
                loading={isLoading}
              >
                {t('STATION.ACTIONS.SET_AS_DEFAULT')}
              </Button>
            </div>
          </div>
        </div>
      </ConfirmAlertModal>
    </>
  );
};
