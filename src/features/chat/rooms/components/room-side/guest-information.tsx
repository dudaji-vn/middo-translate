'use client';

import React, { use, useEffect, useState } from 'react';

import { cn } from '@/utils/cn';
import { Typography } from '@/components/data-display';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateGuestInfoSchema } from '@/configs/yup-form';
import { z } from 'zod';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { Form } from '@/components/ui/form';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { Pen } from 'lucide-react';
import { Button } from '@/components/actions';
import { updateInfoGuestService } from '@/services/user.service';
import toast from 'react-hot-toast';
import { User } from '@/features/users/types';
import { useParams, useRouter } from 'next/navigation';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';

type GuestInformation = Pick<User, '_id' | 'email' | 'phoneNumber'>;
const infoNameFields: Array<keyof GuestInformation> = ['email', 'phoneNumber'];
const mappedLabel: Record<string, string> = {
  email: 'Email',
  phoneNumber: 'Phone Number',
};
const editableFields: Array<keyof GuestInformation> = ['phoneNumber'];

const GuestInformation = (guestData: GuestInformation) => {
  const [open, setOpen] = useState(false);
  const { businessRoomId } = useBusinessNavigationData();
  const params = useParams();
  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      phoneNumber: guestData.phoneNumber,
    },
    resolver: zodResolver(updateGuestInfoSchema),
  });
  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const submit = async ({
    phoneNumber,
  }: z.infer<typeof updateGuestInfoSchema>) => {
    try {
      await updateInfoGuestService({
        phoneNumber,
        userId: guestData._id,
        spaceId: String(params?.spaceId),
        roomId: String(businessRoomId),
      });
      toast.success(`Update phone number success!`);
      setOpen(false);
    } catch (err: any) {
      toast.error(err.response.data.message);
    }
  };
  useEffect(() => {
    setValue('phoneNumber', guestData.phoneNumber || '');
  }, [guestData, open]);
  return (
    <div className="mt-8 flex flex-col items-center gap-2">
      {infoNameFields.map((field) => {
        const editable = editableFields.includes(field);
        return (
          <div
            key={field}
            className={cn(
              'flex w-full flex-row items-center justify-between gap-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 px-3 py-3',
              editable && 'cursor-pointer',
            )}
            onClick={() => {
              if (editable) setOpen(true);
            }}
          >
            <Typography className="capitalize text-neutral-600 dark:text-neutral-50">
              {mappedLabel[field]}
            </Typography>
            <Typography className="flex flex-row items-center gap-2 font-medium text-neutral-800 dark:text-neutral-50">
              {guestData[field]}
              {editable && <Pen size={20} />}
            </Typography>
          </div>
        );
      })}
      <ConfirmAlertModal
        title="Update Guest Information"
        open={open}
        onOpenChange={setOpen}
        cancelProps={{ disabled: isSubmitting }}
        footerProps={{ className: 'hidden' }}
      >
        <Form {...methods}>
          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <RHFInputField
              name="phoneNumber"
              formLabel="Phone Number"
              formLabelProps={{ className: 'pl-0' }}
              inputProps={{
                placeholder: 'Enter phone number',
              }}
            />
            <div className="flex h-fit w-full flex-row justify-end gap-3">
              <Button
                type="button"
                size={'sm'}
                shape="square"
                variant={'ghost'}
                color={'default'}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                shape="square"
                size={'sm'}
                variant={'default'}
                color={'primary'}
                loading={isSubmitting}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </ConfirmAlertModal>
    </div>
  );
};

export default GuestInformation;
