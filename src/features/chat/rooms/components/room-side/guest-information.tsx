'use client';

import React, { useEffect, useState } from 'react';

import { Item, Typography } from '@/components/data-display';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateGuestInfoSchema } from '@/configs/yup-form';
import { z } from 'zod';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { Form } from '@/components/ui/form';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { Clock9, Globe, Mail, Pen, Phone, Tag } from 'lucide-react';
import { Button } from '@/components/actions';
import { updateInfoGuestService } from '@/services/user.service';
import { type User } from '@/features/users/types';
import { useParams } from 'next/navigation';
import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import customToast from '@/utils/custom-toast';
import { Room } from '../../types';
import RoomItemTag from '../room-item/room-item-tag';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

type GuestInformation = Pick<User, '_id' | 'email' | 'phoneNumber'>;
const infoNameFields: Array<keyof GuestInformation> = ['email', 'phoneNumber'];
const mappedLabel: Record<string, string> = {
  email: 'Email',
  phoneNumber: 'Phone Number',
};
const infoIcons: Record<string, JSX.Element> = {
  email: <Mail />,
  phoneNumber: <Phone />,
};
const editableFields: Array<keyof GuestInformation> = ['phoneNumber'];

const GuestInformation = ({
  room,
  guestData,
}: {
  room: Room;
  guestData: GuestInformation;
}) => {
  const [open, setOpen] = useState(false);
  const { businessRoomId } = useBusinessNavigationData();
  const { t } = useTranslation('common');
  const params = useParams();
  const methods = useForm({
    mode: 'onBlur',
    defaultValues: {
      phoneNumber: guestData.phoneNumber,
    },
    resolver: zodResolver(updateGuestInfoSchema),
  });
  const roomTag = room?.space?.tags?.find(
    (tag: Room['tag']) => tag?._id === room?.tag,
  );
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
      customToast.success(`Update phone number success!`);
      setOpen(false);
    } catch (err: any) {
      customToast.error(err.response.data.message);
    }
  };
  useEffect(() => {
    setValue('phoneNumber', guestData.phoneNumber || '');
  }, [guestData, open]);

  return (
    <div className="mt-8 flex w-full flex-col items-center divide-y divide-neutral-50">
      {infoNameFields.map((field) => {
        const editable = editableFields.includes(field);
        return (
          <Item
            key={field}
            className="truncate"
            onClick={() => {
              if (editable) setOpen(true);
            }}
            leftIcon={infoIcons[field]}
            right={editable ? <Pen size={20} /> : null}
          >
            <Typography className="capitalize text-neutral-600 dark:text-neutral-50">
              {mappedLabel[field]}
            </Typography>
            <Typography className="font-medium text-neutral-800 dark:text-neutral-50">
              {guestData[field]}
            </Typography>
          </Item>
        );
      })}
      {roomTag && (
        <Item className={'truncate'} leftIcon={<Tag />}>
          <div className="flex flex-col items-start">
            <RoomItemTag tag={roomTag} />
            <Typography className="font-light text-neutral-800 dark:text-neutral-50">
              <span className="flex items-center gap-1 whitespace-nowrap">
                {t('COMMON.TIME.LAST_EDITED')}
                <Clock9 className="mr-1 inline-block size-3" />
                {moment(room.updatedAt).format('lll')}
              </span>
            </Typography>
          </div>
        </Item>
      )}
      <Item className="truncate" leftIcon={<Globe />}>
        <div className="flex flex-col items-start">
          <Typography className="font-light  text-neutral-600 dark:text-neutral-50">
            {t('EXTENSION.RECEIVED_FROM')}
          </Typography>
          <Typography className="font-medium text-neutral-800 dark:text-neutral-50">
            {room.fromDomain}
          </Typography>
        </div>
      </Item>
      <ConfirmAlertModal
        title="Update Guest Information"
        open={open}
        onOpenChange={setOpen}
        cancelProps={{ disabled: isSubmitting }}
        footerProps={{ className: 'hidden' }}
      >
        <Form {...methods}>
          <form onSubmit={handleSubmit(submit)} className="space-y-4 ">
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
