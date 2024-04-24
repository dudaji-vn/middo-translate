import React, { useEffect } from 'react';

import { Input, RadioGroup, RadioGroupItem } from '@/components/data-entry';
import { RadioGroupProps } from '@radix-ui/react-radio-group';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { DEFAULT_FIRST_MESSAGE } from './options';
import { Label } from '@/components/data-display';
import { Check } from 'lucide-react';
import { RHFTextAreaField } from '@/components/form/RHF/RHFInputFields';
import { translateWithDetection } from '@/services/languages.service';
import { useFormContext } from 'react-hook-form';
import NestedFlow, { FlowNode } from '../steps/script-chat-flow/nested-flow';
import { Edge } from 'reactflow';

export type CustomFirstMessageOptionsProps = {};
type TRadioOptions = 'default' | 'custom' | 'script';

const CustomFirstMessageOptions = ({
  ...props
}: CustomFirstMessageOptionsProps & RadioGroupProps) => {
  const { setValue, watch } = useFormContext();
  const firstMessage = watch('custom.firstMessage');
  const [checked, setChecked] = React.useState<TRadioOptions>(
    firstMessage?.length && firstMessage === DEFAULT_FIRST_MESSAGE.content
      ? 'default'
      : 'custom',
  );

  const scriptChatFlow = watch('custom.chatFlow');

  const onSaveChatFlow = (chatFlow: { nodes: FlowNode[]; edges: Edge[] }) => {
    setValue('custom.chatFlow', chatFlow);
  };
  return (
    <RadioGroup
      {...props}
      className="flex w-full flex-col gap-4"
      onValueChange={(value) => {
        setChecked(value as TRadioOptions);
          switch (value) {
            case 'default':
              setValue('custom.firstMessage', DEFAULT_FIRST_MESSAGE.content);
              break;
            case 'custom':
              setValue('custom.firstMessage', '');
              break;
            case 'script':
              setValue('custom.firstMessage', '');
              break;
          }
      }}
      value={checked}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value="default"
          id="r1"
          iconProps={{ className: 'h-full w-full' }}
          className="border-neutral-200 ring-neutral-200"
        >
          <Check
            className="absolute left-[1px] top-[1px] h-[14px] w-3"
            stroke="white"
          />
        </RadioGroupItem>
        <Label htmlFor="r1">Default</Label>
      </div>
      <Input
        name="firstMessage"
        disabled={checked !== 'default'}
        readOnly
        value={DEFAULT_FIRST_MESSAGE.content}
      />
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value="custom"
          id="r2"
          iconProps={{ className: 'h-full w-full' }}
          className="border-neutral-200 ring-neutral-200"
        >
          <Check
            className="absolute left-[1px] top-[1px] h-[14px] w-3"
            stroke="white"
          />
        </RadioGroupItem>
        <Label htmlFor="r2">Custom</Label>
      </div>
      <RHFTextAreaField
        name={'custom.firstMessage'}
        textareaProps={{
          placeholder: 'Type your custom first message',
          disabled: checked !== 'custom',
          className:
            checked === 'custom'
              ? 'border-primary ring-primary px-2'
              : 'opacity-50 border-neutral-200 ring-neutral-200',
        }}
      />
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value="script"
          id="r2"
          iconProps={{ className: 'h-full w-full' }}
          className="border-neutral-200 ring-neutral-200"
        >
          <Check
            className="absolute left-[1px] top-[1px] h-[14px] w-3"
            stroke="white"
          />
        </RadioGroupItem>
        <Label htmlFor="r2">Script</Label>
      </div>
      {checked === 'custom' && (
        <NestedFlow onSaveToForm={onSaveChatFlow} savedFlow={scriptChatFlow} />
      )}
    </RadioGroup>
  );
};

export default CustomFirstMessageOptions;
