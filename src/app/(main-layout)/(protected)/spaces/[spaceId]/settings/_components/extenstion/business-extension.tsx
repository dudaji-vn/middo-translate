'use client'

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { CopyIcon, Link, MessageSquare, MessagesSquare, PenIcon, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { forwardRef, useCallback } from 'react'
import { generateExtensionCode } from '@/utils/genrerateExtensionCode';
import { cn } from '@/utils/cn';
import { useTextCopy } from '@/hooks/use-text-copy';
import moment from 'moment';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { deleteExtension } from '@/services/extension.service';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { TBusinessExtensionData } from '@/features/chat/help-desk/api/business.service';
import { Card } from '@/components/ui/card';
import { ROUTE_NAMES } from '@/configs/route-name';


export interface BusinessExtensionProps extends React.HTMLAttributes<HTMLDivElement> {

}


const BusinessExtension = forwardRef<HTMLDivElement, BusinessExtensionProps & { data?: TBusinessExtensionData } & { name: string }>(
  ({ data, name, ...props }, ref) => {
    const router = useRouter();
    const params = useParams();
    const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
    const onDeleteExtension = async () => {
      deleteExtension().then(() => {
        toast.success('Extension deleted successfully');
        router.refresh();
      }).catch(() => {
        toast.error('Failed to delete extension');
      });
      setOpenConfirmDialog(false);
    };
    const code = generateExtensionCode(`/help-desk/${data?._id}`, data?.color)
    const { copy } = useTextCopy(code);
    const isEmpty = !data;
    return (<>
      <div className={cn('w-full flex flex-col rounded-[20px] bg-white border border-neutral-50 p-5 gap-3', isEmpty && 'hidden')}{...props}>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex flex-row  items-center justify-start gap-3'>
            <div className='p-4 w-fit  rounded-full bg-white text-primary-500-main shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)] relative'>
              <MessagesSquare className={`w-8 h-8`} />
            </div>
            <Typography className='text-[1rem] flex flex-col gap-1' >
              <span className='font-semibold text-primary-500-main leading-[18px]'>{name}</span>
              <span className='text-neutral-600 font-normal text-base leading-[18px]'>{`Created on: ${moment(data?.createdAt).format('DD/MM/YYYY HH:mm')}`}</span>
            </Typography>
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <Tooltip
              title={'Edit'}
              contentProps={{
                className: 'text-neutral-800',
              }}
              triggerItem={
                <Button.Icon
                  size="xs"
                  variant="ghost"
                  color="default"
                  onClick={() => {
                    if (params?.spaceId)
                      router.push(`${ROUTE_NAMES.SPACES}/${params?.spaceId}/settings`);
                  }}
                >
                  <PenIcon />
                </Button.Icon>
              }
            />
            <Tooltip
              title={'Delete'}
              contentProps={{
                className: 'text-neutral-800',
              }}
              triggerItem={
                <Button.Icon
                  size="xs"
                  onClick={() => setOpenConfirmDialog(true)}
                  variant="default"
                  color="error"
                >
                  <Trash2 />
                </Button.Icon>
              } />
          </div>
        </div>
        <div className="relative w-full bg-[#fafafa]  min-h-fit text-neutral-600 text-sm rounded-xl">
          <Button.Icon
            variant="ghost"
            size={'xs'}
            type="button"
            className='text-neutral-400 absolute right-4 top-1'
            onClick={() => {
              copy();
            }}
          ><CopyIcon />
          </Button.Icon>
          <pre onClick={() => copy()} className="bg-transparent  text-neutral-600 text-sm rounded-lg overflow-auto px-2 whitespace-pre-wrap pr-7">
            <code className='text-neutral-600 text-sm p-2' lang='javascript'>
              {code}
            </code>
          </pre>
        </div>
      </div>
      <ConfirmAlertModal
        title="Delete Extension"
        description="Are you sure you want to delete this extension?"
        open={openConfirmDialog}
        onOpenChange={setOpenConfirmDialog}
        onConfirm={onDeleteExtension}
        onCancel={() => { setOpenConfirmDialog(false) }}
      />
    </>)
  })

BusinessExtension.displayName = 'BusinessExtension';

export default BusinessExtension