import { Typography } from '@/components/data-display';
import React from 'react';
import CustomExtension from '../sections/custom-extension';
import PluginChatPreview from '../sections/plugin-chat-preview';
import { DEFAULT_FIRST_MESSAGE, TThemeOption } from '../sections/options';
import { useFormContext } from 'react-hook-form';
import { TSpace } from '@/app/(main-layout)/(protected)/spaces/[spaceId]/_components/business-spaces';
import { FlowNode } from './script-chat-flow/design-script-chat-flow';

const CustomChatThemeStep = ({ space }: { space: TSpace }) => {
  const {
    trigger,
    watch,
    setValue,
    formState: {},
  } = useFormContext();

  const startingMessageType = watch('startingMessageType');
  const editingChatFlow = watch('custom.chatFlow');

  const firstButtonNode =
    startingMessageType === 'script'
      ? editingChatFlow?.nodes?.find(
          (n: FlowNode) => n?.type === 'button' && n?.data?.content,
        )
      : undefined;
  return (
    <div className=" max-w-screen-md  md:max-w-full   [&_h3]:text-[1.25rem]">
      <div className="flex h-full flex-row divide-x divide-neutral-50  border-neutral-50 dark:border-neutral-900 dark:divide-neutral-900">
        <div className="flex  w-1/3 flex-col gap-3 p-4">
          <Typography
            variant="h5"
            className="text-[1rem] font-semibold text-neutral-900 dark:text-neutral-50"
          >
            Custom style
          </Typography>
          <Typography className=" text-[1rem] font-normal text-neutral-500 dark:text-neutral-50">
            Create your own extension style
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
          firstButtonNode={firstButtonNode}
          onTranslatedChange={(text) => {
            setValue('custom.firstMessageEnglish', text);
          }}
          className="w-2/3"
          content={
            watch('startingMessageType') === 'script'
              ? DEFAULT_FIRST_MESSAGE.content
              : watch('custom.firstMessageEnglish')
          }
          language={watch('custom.language')}
          color={watch('custom.color')}
        />
      </div>
    </div>
  );
};

export default CustomChatThemeStep;
