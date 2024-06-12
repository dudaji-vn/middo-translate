import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/actions';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Pen } from 'lucide-react';
import InviteMembers from '../../../_components/spaces-crud/sections/invite-section';
import { z } from 'zod';
import { useForm, useFormContext } from 'react-hook-form';
import { useGetSpaceData } from '@/features/business-spaces/hooks/use-get-space-data';
import { zodResolver } from '@hookform/resolvers/zod';
import UploadSpaceImage from '../../../_components/spaces-crud/sections/upload-space-image';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { Form } from '@/components/ui/form';
import { Typography } from '@/components/data-display';
import toast from 'react-hot-toast';
import { TEditSpaceFormValues } from '../space-setting/space-setting';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { TSpace } from '../../../_components/business-spaces';
import { createOrEditSpace } from '@/services/business-space.service';

export const EditSpaceModal = ({ space }: { space: Omit<TSpace, 'owner'> }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('common');
  const formEditSpace = useFormContext();
  const {
    formState: { errors },
  } = formEditSpace;

  const onSubmitEditSpaceName = async ({
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
            toast.success('Space name updated successfully');
            router.refresh();
            setOpen(false);
            return;
          }
        })
        .catch((err) => {
          toast.error('Error on update space. Please try again');
        });
    } catch (error) {
      console.error('Error on UpdateSpace:', error);
      toast.error('Error on Update space');
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
        <div className=" max-h-[calc(85vh-48px)] max-w-screen-md  bg-white [&_h3]:mt-4  [&_h3]:text-[1.25rem] dark:bg-background">
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
                  formEditSpace.handleSubmit(onSubmitEditSpaceName)();
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
