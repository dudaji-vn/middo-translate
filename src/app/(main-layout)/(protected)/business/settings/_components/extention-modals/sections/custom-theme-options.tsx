import React from 'react'
import { TThemeOption, DEFAULT_THEME, extentionsCustomThemeOptions } from './options';
import { Button } from '@/components/actions';
import { Check, CircleIcon } from 'lucide-react';
import { FormLabel } from '@/components/ui/form';

export type CustomThemeColorProps = {
  selectedColor: TThemeOption['hex'] | null;
  onChange: (color: TThemeOption['hex']) => void;
};
const CustomThemeOptions = ({
  selectedColor,
  onChange
}: CustomThemeColorProps) => {
  return (
    <div className='p-3 '>
      <FormLabel
        className="mb-1 inline-block text-neutral-900 text-[1rem] font-semibold"
      >
        Theme
      </FormLabel>
      <div className='grid md:grid-cols-6 grid-cols-4 xl:grid-cols-10  lg:grid-cols-8 grid-flow-row '>
        {extentionsCustomThemeOptions.map((color, index) => {
          const isSelect = selectedColor === color.hex;
          return (
            <Button.Icon
              key={color.hex}
              variant="ghost"
              type="button"
              className='!w-fit !h-fit relative'
              onClick={() => selectedColor === color.hex ? onChange(DEFAULT_THEME) : onChange(color.hex)}
            >
              <CircleIcon className='w-6 h-6' stroke={selectedColor === color.hex ? 'var(--color-primary)' : 'var(--color-neutral-500)'} fill={color.hex} />
              <Check stroke='white' className={`absolute top-1 left-1 w-4 h-4 ${isSelect ? 'block' : 'hidden'}`} />
            </Button.Icon>
          )
        })}
      </div>
    </div>
  )
}

export default CustomThemeOptions