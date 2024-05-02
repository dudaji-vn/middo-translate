import { Typography } from '@/components/data-display';
import React from 'react';
import CustomExtension from '../sections/custom-extension';
import PluginChatPreview from '../sections/plugin-chat-preview';
import { TThemeOption } from '../sections/options';
import { useFormContext } from 'react-hook-form';
import { TSpace } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';

const CustomChatThemeStep = ({ space }: { space: TSpace }) => {
  const {
    trigger,
    watch,
    setValue,
    formState: {},
  } = useFormContext();
  return (
    <div className=" max-w-screen-md bg-white  md:max-w-screen-xl [&_h3]:text-[1.25rem]">
      <div className="flex flex-row divide-x divide-neutral-50  border-x border-b border-neutral-50 ">
        <div className="flex  w-1/3 flex-col gap-3 p-4">
          <Typography
            variant="h5"
            className="text-[1rem] font-semibold text-neutral-900"
          >
            Custom style
          </Typography>
          <Typography className=" text-[1rem] font-normal text-neutral-500">
            Create your own extension style{' '}
          </Typography>
          <CustomExtension
            selectedColor={watch('custom.color')}
            onChange={(color: TThemeOption['hex']) => {
              setValue('custom.color', color);
            }}
          />
        </div>
        <PluginChatPreview
          space={space}
          onTranslatedChange={(text) => {
            setValue('custom.firstMessageEnglish', text);
          }}
          className="w-2/3"
          content={watch('custom.firstMessage')}
          language={watch('custom.language')}
          color={watch('custom.color')}
        />
      </div>
    </div>
  );
};

export default CustomChatThemeStep;
