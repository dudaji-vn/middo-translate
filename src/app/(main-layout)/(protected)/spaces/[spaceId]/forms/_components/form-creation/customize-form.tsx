import { Button } from '@/components/actions';
import { Label, Typography } from '@/components/data-display';
import Tooltip from '@/components/data-display/custom-tooltip/tooltip';
import { RadioGroup, RadioGroupItem, Switch } from '@/components/data-entry';
import RHFColorSelector from '@/components/form/RHF-color-selector/rhf-color-selector';
import { FormLabel } from '@/components/ui/form';
import { Check, CircleIcon, Plus, RectangleHorizontal } from 'lucide-react';
import Image from 'next/image';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  DEFAULT_THEME,
  extensionsCustomThemeOptions,
} from '../../../settings/_components/extension-creation/sections/options';
import { cn } from '@/utils/cn';
const formColors = [...extensionsCustomThemeOptions];
const CustomizeForm = () => {
  const { setValue, watch } = useFormContext();
  const selectedColor = watch('customize.theme');
  const selectedLayout = watch('customize.layout');
  const onChange = (color: string) => {
    setValue('customize.theme', color);
  };
  return (
    <div className="flex h-full w-full flex-col  gap-10">
      <div className="flex h-fit w-full cursor-pointer flex-col items-start justify-start gap-3">
        <FormLabel className="font-bold text-neutral-800  dark:text-neutral-50">
          Layout
        </FormLabel>
        <RadioGroup
          className="flex w-full flex-col gap-3 md:flex-row md:gap-4"
          value={watch('customize.layout')}
        >
          <div
            onClick={() => setValue('customize.layout', 'single')}
            className={cn(
              'flex flex-1  cursor-pointer flex-row items-center justify-between gap-3 rounded-[12px] bg-primary-100 p-4 md:p-5',
              selectedLayout === 'single'
                ? 'border border-primary-500-main'
                : '',
            )}
          >
            <div className="flex flex-row items-center justify-start gap-3">
              <Image
                alt="form-layout-single-question"
                width={40}
                height={40}
                src="/form-layout-single-question.svg"
              />
              <Label className="capitalize text-neutral-800">
                One question per page
              </Label>
            </div>
            <RadioGroupItem
              value="single"
              id="single"
              iconProps={{ className: 'size-full' }}
            >
              <Check
                className="absolute right-[1px] top-[1px] h-[14px] w-3"
                stroke="white"
              />
            </RadioGroupItem>
          </div>

          <div
            onClick={() => setValue('customize.layout', 'multiple')}
            className={cn(
              'flex flex-1 cursor-pointer flex-row items-center  justify-between  gap-3 rounded-[12px] bg-primary-100 p-4 md:p-5',
              selectedLayout === 'multiple'
                ? 'border border-primary-500-main'
                : '',
            )}
          >
            <div
              className={cn('flex flex-row items-center justify-start gap-3')}
            >
              <Image
                alt="form-layout-all-questions"
                width={40}
                height={40}
                src="/form-layout-all-questions.svg"
              />
              <Label className="capitalize text-neutral-800">
                All questions on one page
              </Label>
            </div>
            <RadioGroupItem
              value="multiple"
              id="multiple"
              iconProps={{ className: 'size-full inset-0' }}
            >
              <Check
                className="absolute right-[1px] top-[1px] h-[14px] w-3"
                stroke="white"
              />
            </RadioGroupItem>
          </div>
        </RadioGroup>
      </div>
      <div className="flex h-fit w-full flex-col items-start justify-start gap-3">
        <FormLabel className="font-bold text-neutral-800  dark:text-neutral-50">
          Theme
        </FormLabel>
        <div className="flex w-fit flex-row">
          <RHFColorSelector
            itemProps={{ className: '' }}
            colorNameField="customize.theme"
            selectedColor={selectedColor}
            listColors={formColors.map((color) => color.hex)}
            defaultTheme={DEFAULT_THEME}
          />
        </div>
      </div>
      <div className="flex h-fit w-full flex-col items-start justify-start gap-3">
        <FormLabel className="font-bold text-neutral-800  dark:text-neutral-50">
          Background
        </FormLabel>
        <div className="grid w-full  grid-cols-5 gap-3 max-md:p-1">
          {Array.from({ length: 10 }).map((_, index) => {
            const src = `/forms/bg-form-${index + 1}.jpg`;
            const isSelect = watch('customize.background') === src;
            return (
              <div
                key={index}
                className={cn(
                  'aspect-[1.75] size-full cursor-pointer rounded-[16px]  max-md:h-24',
                  isSelect
                    ? 'border-primary-500-main max-md:scale-105 max-md:border max-md:p-1'
                    : '',
                )}
                onClick={() => setValue('customize.background', src)}
              >
                <div
                  className="flex aspect-[1.75]  size-full cursor-pointer rounded-[12px]"
                  style={{
                    backgroundImage: `url(${src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <Check
                    stroke="white"
                    className={cn(
                      `z-10 m-auto size-8 stroke-[3px]`,
                      isSelect ? 'block' : 'hidden',
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomizeForm;
