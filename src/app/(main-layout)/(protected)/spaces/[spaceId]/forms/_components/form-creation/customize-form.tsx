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
import { DEFAULT_THEME } from '../../../settings/_components/extension-creation/sections/options';
import { cn } from '@/utils/cn';
const formColors = [
  {
    name: 'Red',
    hex: '#EF3B36',
  },
  {
    hex: '#E11D59',
    name: 'Pink',
  },
  {
    name: 'Purple',
    hex: '#8E23A3',
  },
  {
    name: 'Deep Purple',
    hex: '#5A33AA',
  },
  {
    name: '#3649A8',
    hex: 'Indigo',
  },
  {
    name: 'Primary',
    hex: DEFAULT_THEME,
  },
];
const CustomizeForm = () => {
  const { setValue, watch } = useFormContext();
  const selectedColor = watch('customize.theme');
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
            className="flex flex-1  cursor-pointer flex-row items-center justify-between gap-3 rounded-[12px] bg-primary-100 p-4 md:p-5"
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
              className=" border-neutral-200 ring-neutral-200 dark:border-neutral-800  dark:ring-neutral-900"
            >
              <Check
                className="absolute right-[1px] top-[1px] h-[14px] w-3"
                stroke="white"
              />
            </RadioGroupItem>
          </div>

          <div
            onClick={() => setValue('customize.layout', 'multiple')}
            className="flex flex-1 cursor-pointer flex-row items-center  justify-between  gap-3 rounded-[12px] bg-primary-100 p-4 md:p-5"
          >
            <div className="flex flex-row items-center justify-start gap-3">
              <Image
                alt="form-layout-all-questions"
                width={40}
                height={40}
                src="/form-layout-all-questions.svg"
              />
              <Label className="capitalize text-neutral-800">
                List all questions on one page
              </Label>
            </div>
            <RadioGroupItem
              value="multiple"
              id="multiple"
              iconProps={{ className: 'h-full w-full' }}
              className="border-neutral-200 ring-neutral-200 dark:border-neutral-800 dark:ring-neutral-900"
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
            itemProps={{ className: 'max-md:[&_svg]:size-7' }}
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
        <div className="grid w-full grid-cols-2  gap-3 md:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => {
            const src = `/forms/bg-form-${index + 1}.svg`;
            const isSelect = watch('customize.background') === src;
            return (
              <div
                key={index}
                className="relative flex aspect-[1.75] size-full cursor-pointer rounded-[12px]"
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                onClick={() => setValue('customize.background', src)}
              >
                <Check
                  stroke="white"
                  className={cn(
                    `m-auto size-8 stroke-[4px]`,
                    isSelect ? 'block' : 'hidden',
                  )}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomizeForm;
