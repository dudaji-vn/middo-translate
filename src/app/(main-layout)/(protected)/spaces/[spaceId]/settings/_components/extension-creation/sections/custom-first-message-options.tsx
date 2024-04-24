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
import NestedFlow, {
  FlowNode,
  initialChatFlowNodes,
  initialEdges,
} from '../steps/script-chat-flow/nested-flow';
import { Edge } from 'reactflow';
import { cn } from '@/utils/cn';

export type CustomFirstMessageOptionsProps = {};
type TRadioOptions = 'default' | 'custom' | 'script';

const CustomFirstMessageOptions = ({
  ...props
}: CustomFirstMessageOptionsProps & RadioGroupProps) => {
  const { setValue, watch } = useFormContext();
  const firstMessage = watch('custom.firstMessage');
  const scriptChatFlow = watch('custom.chatFlow');
  const selectedRadioFM = watch('selectedRadioFM') || 'default';

  const onSaveChatFlow = (chatFlow: { nodes: FlowNode[]; edges: Edge[] }) => {
    const root = chatFlow.nodes.find((node) => node.type === 'root');
    const edgeNextToRoot = chatFlow.edges.find(
      (edge) => edge.source === root?.id,
    );
    const nodeNextToRoot = chatFlow.nodes.find(
      (node) => node.id === edgeNextToRoot?.target && node.type !== 'option',
    );
    if (nodeNextToRoot) {
      const firstMessage = nodeNextToRoot.data?.content;
      setValue('custom.firstMessage', firstMessage);
    }
    setValue('custom.chatFlow', chatFlow);
  };
  return (
    <RadioGroup
      {...props}
      className="flex w-full flex-col gap-4"
      onValueChange={(value) => {
        switch (value) {
          case 'default':
            setValue('custom.firstMessage', DEFAULT_FIRST_MESSAGE.content);
            break;
          case 'custom':
            setValue('custom.firstMessage', '');
            break;
          case 'script':
            setValue('custom.firstMessage', '');
            if (
              !scriptChatFlow ||
              !scriptChatFlow.nodes.length <= 1 ||
              !scriptChatFlow.edges.length <= 1
            )
              setValue('custom.chatFlow', null);
            break;
        }
        setValue('selectedRadioFM', value);
      }}
      value={selectedRadioFM}
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
        disabled={selectedRadioFM !== 'default'}
        readOnly
        wrapperProps={{
          className: cn({
            hidden: selectedRadioFM !== 'default',
          }),
        }}
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
        formItemProps={{
          className: cn({
            hidden: selectedRadioFM !== 'custom',
          }),
        }}
        name={'custom.firstMessage'}
        textareaProps={{
          hidden: selectedRadioFM !== 'custom',
          placeholder: 'Type your custom first message',
          disabled: selectedRadioFM !== 'custom',
          className:
            selectedRadioFM === 'custom'
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
      {selectedRadioFM === 'script' && (
        <div className={cn('')}>
          <NestedFlow
            onSaveToForm={onSaveChatFlow}
            savedFlow={scriptChatFlow}
          />
        </div>
      )}
    </RadioGroup>
  );
};

export default CustomFirstMessageOptions;
