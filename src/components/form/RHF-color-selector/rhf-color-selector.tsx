'use client'

import React from 'react'
import Tooltip from '../../data-display/custom-tooltip/tooltip';
import { DEFAULT_THEME, TThemeOption, extentionsCustomThemeOptions } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/extension-creation/sections/options';
import { Button } from '../../actions';
import { Check, CircleIcon, Plus, RefreshCcw } from 'lucide-react';
import { generateRandomHexColor, getContrastingTextColor } from '@/utils/color-generator';
import RHFInputField from '../RHF/RHFInputFields/RHFInputField';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/utils/cn';

export const COLOR_REGEX = /^#[0-9A-F]{6}$/i;

export type TColorSelectorProps = {
    selectedColor: string;
    colorNameFiled: string;
}
const RHFColorSelector = ({
    selectedColor,
    colorNameFiled,
}: TColorSelectorProps) => {
    const [openManualAddColor, setOpenManualAddColor] = React.useState(false);
    const { setValue } = useFormContext();
    const onRandomColor = () => {
        setValue(colorNameFiled, generateRandomHexColor());
    }
    const onClickManualAddColor = () => {
        setOpenManualAddColor(true);
    }
    const isTagColorValid = COLOR_REGEX.test(selectedColor);
    return (
        <div className='grid md:grid-cols-6 grid-cols-4 xl:grid-cols-10  lg:grid-cols-8 grid-flow-row '>
            {extentionsCustomThemeOptions.map((color, index) => {
                const isSelect = selectedColor === color.hex;
                return (<Tooltip
                    title={color.name}
                    key={color.hex}
                    contentProps={{
                        className: 'text-neutral-800 capitalize',
                    }}
                    triggerItem={
                        <Button.Icon
                            variant="ghost"
                            type="button"
                            className='!w-6 !h-6 relative'
                            onClick={() => {
                                setValue(colorNameFiled, color.hex);
                            }}
                        >
                            <CircleIcon className='w-6 h-6' stroke={selectedColor === color.hex ? 'var(--color-primary)' : 'var(--color-neutral-500)'} fill={color.hex} />
                            <Check stroke='white' className={`absolute top-1 left-1 w-4 h-4 ${isSelect ? 'block' : 'hidden'}`} />
                        </Button.Icon>
                    } />
                )
            })}
            <Button.Icon
                variant="ghost"
                type="button"
                onClick={onClickManualAddColor}
                className='!w-6 !h-6  relative hover:bg-neutral-200 bg-neutral-100'
            >
                <Plus stroke='grey' className={`absolute top-1 left-1 w-4 h-4 stroke-neutral-700 `} />
            </Button.Icon>
            <div className={cn('w-full relative flex flex-row gap-3 items-start rounded-[12px]',
                { 'hidden': !openManualAddColor }
            )}>
                <RHFInputField
                    name={colorNameFiled}
                    formItemProps={{
                        className: 'w-full'
                    }}
                    inputProps={{
                        placeholder: DEFAULT_THEME
                    }} />
                <Button.Icon
                    shape={'square'}
                    size={'xs'}
                    variant={'default'}
                    className='mt-[6px]'
                    style={{
                        backgroundColor: isTagColorValid ? selectedColor : '#000',
                        color: isTagColorValid ? getContrastingTextColor(selectedColor) : '#fff'
                    }}
                    onClick={onRandomColor}
                >
                    <RefreshCcw size={15} />
                </Button.Icon>
            </div>
        </div>
    )
}

export default RHFColorSelector