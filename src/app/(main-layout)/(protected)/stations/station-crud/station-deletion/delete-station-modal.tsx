import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button, ButtonProps } from '@/components/actions';
import { Trash2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { Typography } from '@/components/data-display';
import { ROUTE_NAMES } from '@/configs/route-name';
import customToast from '@/utils/custom-toast';
import { deleteStation } from '@/services/station.service';
import { TStation } from '../../_components/type';

export const DeleteStationModal = ({
  station,
}: {
  station: Omit<TStation, 'owner'>;
  deleteBtnProps?: ButtonProps;
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('common');
  const form = useFormContext();
  const {
    formState: { errors },
  } = form;

  const onSubmitDeleteStationName = async () => {
    if (!station._id) return;
    try {
      await deleteStation(station._id)
        .then((res) => {
          if (res.data) {
            customToast.success('Station name deleted successfully');
            router.push(ROUTE_NAMES.STATIONS);
            setOpen(false);
            return;
          }
        })
        .catch((err) => {
          customToast.error('Error on delete station. Please try again');
        });
    } catch (error) {
      console.error('Error on deleteStation:', error);
      customToast.error('Error on delete station');
    }
  };

  return (
    <>
      <Button
        startIcon={<Trash2 size={15} />}
        onClick={() => setOpen(true)}
        color={'default'}
        shape={'square'}
        className="min-w-fit  text-error max-sm:hidden"
        size={'xs'}
      >
        {t('MODAL.DELETE_STATION.TITLE')}
      </Button>
      <ConfirmAlertModal
        title={`Delete station`}
        open={open}
        onOpenChange={setOpen}
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
                onClick={() => setOpen(false)}
                color={'default'}
                shape={'square'}
                size={'sm'}
              >
                {t('COMMON.CANCEL')}
              </Button>
              <Button
                type="button"
                color={'error'}
                shape={'square'}
                size={'sm'}
                onClick={() => {
                  form.handleSubmit(onSubmitDeleteStationName)();
                  setOpen(false);
                }}
                loading={form.formState.isSubmitting}
                disabled={!!errors['name']}
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
