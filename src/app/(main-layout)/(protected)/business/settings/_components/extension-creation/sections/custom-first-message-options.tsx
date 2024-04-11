import React, { useEffect } from 'react'

import { Input, RadioGroup, RadioGroupItem } from '@/components/data-entry';
import { RadioGroupProps } from '@radix-ui/react-radio-group';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { DEFAULT_FIRST_MESSAGE } from './options';
import { Label } from '@/components/data-display';
import { Check } from 'lucide-react';
import { RHFTextAreaField } from '@/components/form/RHF/RHFInputFields';
import { translateWithDetection } from '@/services/languages.service';
import { useFormContext } from 'react-hook-form';

export type CustomFirstMessageOptionsProps = {
    firstMessage: string;
    onFirstMessageChange: (value: string) => void;
}
type TRadioOptions = 'default' | 'custom';

const CustomFirstMessageOptions = ({ firstMessage, onFirstMessageChange, ...props }: CustomFirstMessageOptionsProps & RadioGroupProps) => {
    const [checked, setChecked] = React.useState<TRadioOptions>(firstMessage?.length && firstMessage === DEFAULT_FIRST_MESSAGE.content ? 'default' : 'custom');
    const [previousText, setPreviousText] = React.useState({
        firstMessage: '',
        firstMessageEnglish: ''
    })
    const { setValue, watch } = useFormContext();
    return (
        <RadioGroup
            {...props}
            className='flex flex-col gap-4 w-full'
            onValueChange={(value) => {
                setChecked(value as TRadioOptions)
                if (value === 'default') {
                    setPreviousText({
                        firstMessage: watch('custom.firstMessage'),
                        firstMessageEnglish: watch('custom.firstMessageEnglish')
                    })
                    setValue('custom.firstMessage', DEFAULT_FIRST_MESSAGE.content);
                    setValue('custom.firstMessageEnglish', DEFAULT_FIRST_MESSAGE.content);
                }
                else {
                    setValue('custom.firstMessage', previousText.firstMessage);
                    setValue('custom.firstMessageEnglish', previousText.firstMessageEnglish);
                };
            }}
            value={checked}
        >
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="r1" iconProps={{ className: 'h-full w-full' }} className='border-neutral-200 ring-neutral-200' >
                    <Check className='w-3 h-[14px] absolute top-[1px] left-[1px]' stroke='white' />
                </RadioGroupItem>
                <Label htmlFor="r1">Default</Label>
            </div>
            <Input
                name='firstMessage'
                disabled={checked !== 'default'}
                readOnly
                value={DEFAULT_FIRST_MESSAGE.content}
            />
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="r2" iconProps={{ className: 'h-full w-full' }} className='border-neutral-200 ring-neutral-200' >
                    <Check className='w-3 h-[14px] absolute top-[1px] left-[1px]' stroke='white' />
                </RadioGroupItem>
                <Label htmlFor="r2">Custom</Label>
            </div>
            <RHFTextAreaField
                name={'custom.firstMessage'}
                formItemProps={{
                    className: checked === 'custom' ? '' : 'hidden',
                }}

                textareaProps={{
                    placeholder: 'Type your custom first message',
                    disabled: checked !== 'custom',
                    className: checked === 'custom' ? 'border-primary ring-primary px-2' : 'opacity-50 border-neutral-200 ring-neutral-200',
                }}
            />
        </RadioGroup >
    )
}

export default CustomFirstMessageOptions