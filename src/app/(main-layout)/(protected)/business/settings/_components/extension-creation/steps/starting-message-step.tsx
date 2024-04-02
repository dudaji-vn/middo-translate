import { FormLabel } from '@/components/ui/form';
import React from 'react'
import CustomFirstMessageOptions from '../sections/custom-first-message-options';
import { useFormContext } from 'react-hook-form';

const StartingMessageStep = () => {
    const { trigger, watch, setValue, formState: {
        errors,
        isValid,
        isSubmitting,
        isSubmitSuccessful
    } } = useFormContext();
    return (
        <div className='flex flex-col gap-3 p-3'>
            <FormLabel
                className="mb-1 inline-block text-neutral-900 text-[1rem] font-semibold"
            >
                Starting message
            </FormLabel>
            <CustomFirstMessageOptions
                firstMessage={watch('custom.firstMessage')}
                onFirstMessageChange={(message) => {
                    setValue('custom.firstMessage', message);
                }}
            />
        </div>
    )
}

export default StartingMessageStep