'use client';

import React, { cloneElement, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { cn } from '@/utils/cn';
import { Button, CopyZoneClick } from '@/components/actions';
import {
  Calendar,
  Clock,
  CopyCheck,
  CopyIcon,
  Grip,
  GripHorizontal,
  GripVertical,
  Plus,
  SquareCheck,
  Trash,
  Trash2,
  Type,
} from 'lucide-react';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/data-display/accordion';
import { Typography } from '@/components/data-display';
import { FormField } from './schema';
import { Switch } from '@/components/data-entry';

const fieldOptions = [
  {
    label: 'Text Input',
    value: 'text',
  },
  {
    label: 'Multiple Choice',
    value: 'checkbox',
  },
  {
    label: 'Single Choice',
    value: 'radio',
  },
  {
    label: 'Date',
    value: 'date',
  },
  {
    label: 'Time',
    value: 'time',
  },
];
const typeIcons: { [key: string]: JSX.Element } = {
  // TODO: Add icons for each type
  text: <Type size={20} />,
  checkbox: <SquareCheck size={20} />,
  radio: <CopyCheck size={20} />,
  date: <Calendar size={20} />,
  time: <Clock size={20} />,
};

const RenderField = ({ field, index }: { field: any; index: number }) => {
  const { control } = useFormContext();
  const { type, required, options, name } = field || {};
  const [open, setOpen] = React.useState(false);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: `formFields[${index}].options`,
    },
  );
  const hasOtherOption = useMemo(
    () => fields.some((option: any) => option?.value === 'Other'),
    [fields],
  );

  return (
    <AccordionItem
      key={field.id}
      value={field.id}
      id={'field' + field.id}
      className="rounded-xl border"
    >
      <div
        className={cn(
          'flex h-12 w-full flex-row items-center justify-between gap-2',
          'rounded-t-xl  bg-primary-100 px-5 text-left text-base hover:no-underline dark:bg-neutral-800 md:text-lg  ',
          'field' + field.id,
        )}
      >
        <div className="flex flex-row items-center gap-2">
          <GripVertical size={20} className="text-neutral-600" />
          {cloneElement(typeIcons[type], {
            className: 'text-primary-500-main font-semibold size-6',
          })}
          <RHFInputField
            name={`formFields[${index}].name`}
            formItemProps={{
              className: 'w-full ',
            }}
            inputProps={{
              placeholder: 'Enter field name',
              className:
                'outline-none text-primary-500-main capitalize p-0 border-none !bg-transparent',
            }}
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row items-center gap-2 text-neutral-600">
            <Typography>Required</Typography>
            <Switch />
          </div>
          <CopyZoneClick text={name}>
            <Button.Icon
              disabled={!name}
              variant="ghost"
              color="primary"
              size="xs"
            >
              <CopyIcon />
            </Button.Icon>
          </CopyZoneClick>
          <Button.Icon variant="ghost" color="error" size="xs">
            <Trash2 />
          </Button.Icon>
          <AccordionTrigger className="flex flex-row items-center gap-2" />
        </div>
      </div>

      <AccordionContent className="px-5 py-5 text-base">
        <div className="flex flex-col gap-2">
          <RHFInputField
            name={`formFields[${index}].label`}
            formLabel="Label"
            formItemProps={{
              className: 'w-full',
            }}
            inputProps={{
              placeholder: 'What is your question?',
              className: '',
            }}
          />
          <RHFInputField
            name={`formFields[${index}].placeholder`}
            formLabel="Helper Text"
            formItemProps={{
              className: 'w-full',
            }}
            inputProps={{
              placeholder:
                'Appears below the Label to guide your Collaborators, just like this helper text!',
              className: '',
            }}
          />
          <div className="flex w-full flex-col gap-3 pt-3">
            {fields.map((option, optionIndex) => (
              <div
                key={option.id}
                className={cn(
                  'lex-row flex h-12 w-full items-center justify-between gap-2',
                  'field' + field.id,
                )}
              >
                <GripVertical size={20} className="text-neutral-600" />
                <RHFInputField
                  name={`formFields[${index}].options[${optionIndex}].value`}
                  formItemProps={{ className: 'w-full ' }}
                  inputProps={{
                    placeholder: 'Enter field name',
                    className: 'text-primary-500-main capitalize',
                    disabled: hasOtherOption,
                  }}
                />

                <Button.Icon
                  variant="ghost"
                  color="error"
                  size="xs"
                  onClick={() => remove(optionIndex)}
                >
                  <Trash2 />
                </Button.Icon>
              </div>
            ))}
            <div className="flex flex-row gap-2">
              <div className="invisible w-6" />
              <Button
                onClick={() => append({ value: '' })}
                color={'secondary'}
                shape={'square'}
                size={'xs'}
                startIcon={<Plus size={18} />}
              >
                Add Option
              </Button>
              <Button
                onClick={() => append({ value: 'Other' })}
                color={'secondary'}
                shape={'square'}
                size={'xs'}
                startIcon={<Plus size={18} />}
                className={cn(
                  'flex items-center gap-2 ',
                  hasOtherOption ? 'hidden' : 'visible',
                )}
              >
                Add &ldquo;Other&ldquo; Option
              </Button>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

function ArrayFields() {
  const { control, register } = useFormContext(); // retrieve all hook methods
  const [open, setOpen] = React.useState(false);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: 'formFields',
    },
  );
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <div className="flex h-auto w-full flex-col gap-2">
      <Accordion
        type="multiple"
        className="flex flex-col gap-5"
        // value={}
        // onValueChange={(val: string) => onChangeAccordion(val, 0)}
      >
        {fields.map((field, index) => (
          <RenderField key={field.id} field={field} index={index} />
        ))}
      </Accordion>

      <div
        className={cn('flex flex-row gap-3 p-2 transition-all duration-700')}
        onMouseLeave={onClose}
      >
        <Button.Icon
          onClick={onOpen}
          color={'secondary'}
          size={'xs'}
          onMouseEnter={onOpen}
          className={cn(
            'transition-all duration-500',
            open ? 'rotate-180' : 'rotate-0',
          )}
        >
          <Plus size={18} />
        </Button.Icon>
        <div
          onMouseLeave={onClose}
          className={cn(
            'h-auto w-fit origin-top-left space-y-2  rounded-[12px] border border-dashed border-primary-500-main  bg-transparent p-2 shadow-[2px_4px_16px_2px_#1616161A] transition-all  duration-500',
            open ? 'scale-100' : 'scale-0',
          )}
        >
          {fieldOptions.map((option) => (
            <Button
              key={option.value}
              size={'xs'}
              color="default"
              onClick={() => {
                append({
                  name: `New ${option.label}`,
                  type: option.value,
                  required: false,
                  options: [],
                });
                setOpen(false);
              }}
              className="flex h-10 w-full flex-row justify-start gap-2"
              shape={'square'}
            >
              {cloneElement(typeIcons[option.value], {
                className: ' size-5',
              })}
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ArrayFields;
