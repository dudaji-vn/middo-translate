import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/actions';
import { Pen } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { TEditSpaceFormValues } from '../space-setting/space-setting';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { TSpace } from '../../../_components/business-spaces';
import { createOrEditSpace } from '@/services/business-space.service';
import customToast from '@/utils/custom-toast';

export const EditSpaceModal = ({ space }: { space: Omit<TSpace, 'owner'> }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('common');
  const formEditSpace = useFormContext();
  const {
    formState: { errors },
  } = formEditSpace;

  const onSubmitteditSpaceName = async ({
    name,
  }: Partial<TEditSpaceFormValues>) => {
    if (!name) return;
    try {
      await createOrEditSpace({
        spaceId: space._id,
        name,
      })
        .then((res) => {
          if (res.data) {
            customToast.success('Space name updated successfully');
            router.refresh();
            setOpen(false);
            return;
          }
        })
        .catch((err) => {
          customToast.error('Error on update space. Please try again');
        });
    } catch (error) {
      console.error('Error on UpdateSpace:', error);
      customToast.error('Error on Update space');
    }
  };

  return (
    <>
      <Button.Icon onClick={() => setOpen(true)} color={'default'} size={'xs'}>
        <Pen size={15} />
      </Button.Icon>
      <ConfirmAlertModal
        title="Editing space"
        open={open}
        onOpenChange={setOpen}
        footerProps={{
          className: 'hidden',
        }}
      >
        <div className=" max-h-[calc(85vh-48px)] max-w-screen-md  bg-white dark:bg-background  [&_h3]:mt-4 [&_h3]:text-[1.25rem]">
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full flex-row items-center gap-3 rounded-[12px]">
              <RHFInputField
                name="name"
                formItemProps={{
                  className: 'w-full',
                }}
                inputProps={{
                  placeholder: t('MODAL.CREATE_SPACE.PLACEHOLDERS.NAME'),
                  required: true,
                }}
              />
            </div>
            <div className="flex w-full flex-row items-center justify-end gap-3">
              <Button
                onClick={() => setOpen(false)}
                color={'default'}
                shape={'square'}
                size={'sm'}
              >
                Cancel
              </Button>
              <Button
                type="button"
                color={'primary'}
                shape={'square'}
                size={'sm'}
                onClick={() => {
                  formEditSpace.handleSubmit(onSubmitteditSpaceName)();
                  setOpen(false);
                }}
                loading={formEditSpace.formState.isSubmitting}
                disabled={!!errors['name']}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </ConfirmAlertModal>
    </>
  );
};
