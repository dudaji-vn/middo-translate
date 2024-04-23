'use client'

import React from 'react'
import { DEFAULT_THEME, extensionsCustomThemeOptions } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/settings/_components/extension-creation/sections/options';
import { Button, ButtonProps } from '../../actions';
import { Check, CircleIcon, Plus, XIcon } from 'lucide-react';
import { generateRandomHexColor } from '@/utils/color-generator';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/utils/cn';

export const COLOR_REGEX = /^#[0-9A-F]{6}$/i;

export type TColorSelectorProps = {
    selectedColor: string;
    colorNameFiled: string;
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    gridContainerProps?: React.HTMLAttributes<HTMLDivElement>;
    itemProps?: ButtonProps;
    randomButtonProps?: React.HTMLAttributes<HTMLButtonElement>;
    addButtonProps?: React.HTMLAttributes<HTMLButtonElement>;
    listColors?: string[];

}
const RHFColorSelector = ({
    selectedColor,
    colorNameFiled,
    wrapperProps,
    gridContainerProps,
    itemProps,
    randomButtonProps,
    addButtonProps,
    listColors,

}: TColorSelectorProps) => {
    const { setValue } = useFormContext();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const onRandomColor = () => {
        setValue(colorNameFiled, generateRandomHexColor());
    }
    const onClickManualAddColor = () => {
        inputRef.current?.click();
    }
    const colorOptions = listColors || extensionsCustomThemeOptions.map(color => color.hex);

    const manualColor = selectedColor && !extensionsCustomThemeOptions.find(color => color.hex === selectedColor);
    return (
        <div {...wrapperProps} className={cn('w-full flex flex-col gap-3', wrapperProps?.className)}>
            <div
                {...gridContainerProps}
                className={cn('grid grid-cols-4 sm:grid-cols-8 md:grid-cols-14  xl:grid-cols-16 2xl:grid-cols-20 lg:grid-cols-8 grid-flow-row ', gridContainerProps?.className)}>
                {colorOptions.map((color, index) => {
                    const isSelect = selectedColor === color
                    return (
                        <Button.Icon
                            key={color}
                            variant="ghost"
                            type="button"
                            {...itemProps}
                            className={cn('size-8 bg-transparent relative', itemProps?.className)}
                            onClick={() => {
                                setValue(colorNameFiled, color);
                            }}
                        >
                            <CircleIcon className='absolute inset-0 size-full m-auto' stroke={selectedColor === color ? 'var(--color-primary)' : 'var(--color-neutral-500)'} fill={color} />
                            <Check stroke='white' className={`absolute inset-0 size-[50%]  m-auto ${isSelect ? 'block' : 'hidden'}`} />
                        </Button.Icon>

                    )
                })}
                <Button.Icon
                    // variant="ghost"
                    color={'default'}
                    type="button"
                    {...itemProps}
                    onClick={(e) => {
                        if (manualColor) {
                            setValue(colorNameFiled, DEFAULT_THEME);
                        } else {
                            onClickManualAddColor();
                        }
                    }}
                    className={cn('size-8 bg-transparent border-[2px] border-white relative', itemProps?.className)}
                >
                    {manualColor && <CircleIcon className='absolute inset-0 size-full m-auto' stroke={selectedColor || '#FAFAFA'} fill={selectedColor || '#FAFAFA'} />}
                    <input
                        onChange={(e) => {
                            setValue(colorNameFiled, e.target.value);
                        }}
                        ref={inputRef}
                        type='color'
                        className='inset-0 absolute invisible'
                    />

                    {manualColor ? <>
                        <Check stroke='white' className={`absolute inset-0 size-[50%] hover:hidden m-auto`} />
                        <Button.Icon
                            color={'default'}
                            className='!w-[16px] !h-[16px] absolute -right-0  -top-0 p-1 bg-black text-white opacity-60 hover:opacity-100' >
                            <XIcon />
                        </Button.Icon>

                    </>
                        : <Plus stroke='grey' className={`absolute inset-0 w-6 h-6 m-auto stroke-neutral-700 `} />}
                </Button.Icon>

            </div>
            <div className={cn('w-full relative flex flex-row gap-3 items-start rounded-[12px]',

            )}>

            </div>
        </div >
    )
}

export default RHFColorSelector