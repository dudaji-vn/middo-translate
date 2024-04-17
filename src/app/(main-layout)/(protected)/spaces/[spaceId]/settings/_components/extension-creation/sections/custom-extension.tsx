import React from 'react'
import { TThemeOption, DEFAULT_THEME, extentionsCustomThemeOptions } from './options';
import { Button } from '@/components/actions';
import { Check, CircleIcon, Info, Plus } from 'lucide-react';
import { FormLabel } from '@/components/ui/form';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';

export type CustomThemeColorProps = {
  selectedColor: TThemeOption['hex'] | null;
  onChange: (color: TThemeOption['hex']) => void;
};
const CustomExtension = ({
  selectedColor,
  onChange
}: CustomThemeColorProps) => {
  // TODO: Implement this feature
  const isPro = false;

  return (<section className='flex flex-col gap-1'>
    <div className='p-3 bg-primary-100'>
      <FormLabel
        className="mb-3 inline-block text-neutral-500 text-[1rem] font-normal"
      >
        Theme
      </FormLabel>
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
                onClick={() => selectedColor === color.hex ? onChange(DEFAULT_THEME) : onChange(color.hex)}
              >
                <CircleIcon className='w-6 h-6' stroke={selectedColor === color.hex ? 'var(--color-primary)' : 'var(--color-neutral-500)'} fill={color.hex} />
                <Check stroke='white' className={`absolute top-1 left-1 w-4 h-4 ${isSelect ? 'block' : 'hidden'}`} />
              </Button.Icon>
            } />
          )
        })}
        <Tooltip
          title={'Custom (This feature is not available yet)'}
          contentProps={{
            className: 'text-neutral-800',
          }}
          triggerItem={
            <Button.Icon
              variant="ghost"
              type="button"
              className='!w-6 !h-6  relative hover:bg-neutral-200 bg-neutral-100'
            >
              <Plus stroke='grey' className={`absolute top-1 left-1 w-4 h-4 stroke-neutral-700 `} />
            </Button.Icon>
          } />
      </div>
    </div>
    <div className={cn('p-3 bg-primary-100 flex flex-row items-center justify-between', isPro ? '' : 'opacity-70')} >
      <FormLabel
        className="mb-3 inline-block text-neutral-500 text-[1rem] font-normal"
      >
        Conversation icon
      </FormLabel>
      <div className='text-primary-500-main flex items-center gap-1'>
        <Typography className='text-primary-500-main font-semibold'>PRO</Typography>
        <Info size={11} />
      </div>
    </div>
    <div className={cn('p-3 bg-primary-100 flex flex-row items-center justify-between', isPro ? '' : 'opacity-70')} >
      <FormLabel
        className="mb-3 inline-block text-neutral-500 text-[1rem] font-normal"
      >
        Middo icon
      </FormLabel>
      <div className='text-primary-500-main flex items-center gap-1'>
        <Typography className='text-primary-500-main font-semibold'>PRO</Typography>
        <Info size={11} />
      </div>
    </div>
    <div className={cn('p-3 bg-primary-100 flex flex-row items-center justify-between', isPro ? '' : 'opacity-70')} >
      <FormLabel
        className="mb-3 inline-block text-neutral-500 text-[1rem] font-normal"
      >
        Video call
      </FormLabel>
      <div className='text-primary-500-main flex items-center gap-1'>
        <Typography className='text-primary-500-main font-semibold'>PRO</Typography>
        <Info size={11} />
      </div>  
    </div>
  </section>
  )
}

export default CustomExtension