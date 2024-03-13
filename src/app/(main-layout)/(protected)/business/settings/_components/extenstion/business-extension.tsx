'use client'

import { Button } from '@/components/actions';
import { Typography } from '@/components/data-display';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { PenIcon, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { forwardRef, useCallback } from 'react'
import { generateExtensionCode } from '../extention-modals/genrerateExtensionCode';
import { cn } from '@/utils/cn';
import CreateExtensionModal from '../extention-modals/create-extension-modal';

export type TBusinessExtensionData = {
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  domains: string[];
  color: string;
  language: string;
  firstMessage: string;
  firstMessageEnglish: string;
  id: string;
};
export interface BusinessExtensionProps extends React.HTMLAttributes<HTMLDivElement> {

}


const BusinessExtension = forwardRef<HTMLDivElement, BusinessExtensionProps & { data?: TBusinessExtensionData } & { name: string }>(
  ({ data, id, name, ...props }, ref) => {
    const [modalState, setModalState] = React.useState<{
      open: boolean;
      isEditing: boolean;
      data?: TBusinessExtensionData;
    
    }>({
      open: false,
      isEditing: false,
      data,
    });
    const onOpenModalChange = useCallback((open: boolean) => {
      setModalState((prev) => ({
        ...prev,
        open,
      }));
    }, []);
    const isEmpty = !data;
    return (<>
      <div className={cn('w-full flex flex-col rounded-[20px] border p-5 gap-3', isEmpty && 'hidden')}{...props}>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex flex-row  items-center justify-start'>
            <Image src="/notify-logo.png" width={64} height={'66'} alt={name} className='rounded-[20px] opacity-30' />
            <Typography className='text-[1rem] flex flex-col' >
              <span className='font-semibold'>{name}</span>
              <span className='text-neutral-600'>{`Created on: ${data?.updatedAt}`}</span>
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
                    setModalState({
                      open: true,
                      isEditing: true,
                      data,
                    })
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
                  variant="default"
                  color="error"
                >
                  <Trash2 />
                </Button.Icon>
              } />


          </div>
        </div>
        <div>
          <pre className='bg-neutral-50 rounded-[20px] w-full overflow-x-auto'>
            <code className='text-neutral-600 text-sm' lang='javascript'>
              {generateExtensionCode()}
            </code>
          </pre>
        </div>
      </div>
      <CreateExtensionModal initialData={modalState.data} open={modalState.open} title={modalState?.isEditing ? 'Edit Extension' : 'Create Extension'} onOpenChange={onOpenModalChange} />
      <Button variant={'default'} color={'primary'} shape={'square'} onClick={() => {
        setModalState({
          open: true,
          isEditing: false,
        })
      }} className={isEmpty ? 'mt-4 w-fit mx-auto' : 'hidden'} >
        <Plus className="h-4 w-4" />
        <Typography className="ml-2 text-white">
          Create Extension
        </Typography>
      </Button>

    </>)
  })

BusinessExtension.displayName = 'BusinessExtension';

export default BusinessExtension