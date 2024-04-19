'use client';



import React, { } from 'react';

import { Typography } from '@/components/data-display';
import { Button } from '@/components/actions';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import UploadSpaceImage from './upload-space-image';
import { useFormContext } from 'react-hook-form';


const CreateSpaceForm = () => {

    return (
        <section
            className='max-w-[800px] h-[calc(100vh-220px)] min-h-80  flex flex-col items-center justify-center gap-8'
        >
            <div className='w-full flex flex-col  gap-3'>
                <Typography className='text-neutral-800 text-[32px] font-semibold leading-9'>
                    Give <span className='text-primary-500-main'>your space</span> some information
                </Typography>
                <Typography className='text-neutral-600 font-normal'>
                    Help your crews to recognize your business easier by naming this space, adding space avatar or company&apos;s logo <span className='font-light'>(optional)</span>.
                </Typography>
            </div>
            <div className='w-full flex flex-row gap-3 p-3 bg-primary-100 items-center rounded-[12px]'>
                <UploadSpaceImage nameField='avatar' />
                <RHFInputField name='name'
                    formItemProps={{
                        className: 'w-full'
                    }}
                    inputProps={{
                        placeholder: 'Enter space name',
                        required: true,
                    }} />
            </div>

        </section>
    )
}

export default CreateSpaceForm