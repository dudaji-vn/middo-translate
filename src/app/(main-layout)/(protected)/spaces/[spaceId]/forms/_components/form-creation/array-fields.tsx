'use client';

import React, { cloneElement, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';

import { cn } from '@/utils/cn';
import { Button, CopyZoneClick } from '@/components/actions';
import {
  Calendar,
  Check,
  ChevronDown,
  Circle,
  Clock,
  CopyCheck,
  CopyIcon,
  GripVertical,
  ImageIcon,
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
import { FormField, FormFieldDataTypes, FormFieldType } from './schema';
import { Switch } from '@/components/data-entry';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

const fieldOptions = [
  {
    label: 'Text Input',
    value: 'input',
  },
  {
    label: 'Multiple Choice',
    value: 'checkbox',
  },
  {
    label: 'Single Choice',
    value: 'radio',
  },
];
const typeIcons: Record<FormFieldType, React.ReactElement> = {
  input: <Type size={20} />,
  checkbox: <SquareCheck size={20} />,
  radio: <CopyCheck size={20} />,
};

const TypeSelection = ({ field, index }: { field: any; index: number }) => {
  const { control, setValue, watch } = useFormContext();

  const inputTypes: Array<{ type: FormFieldDataTypes; label: string }> = [
    {
      type: 'text',
      label: 'Text',
    },
    {
      type: 'long-text',
      label: 'Long Text',
    },
    {
      type: 'date',
      label: 'Date',
    },
    {
      type: 'time',
      label: 'Time',
    },
  ];
  const current = watch(`formFields[${index}].dataType`);

  const onTypeChange = (type: FormFieldDataTypes) => {
    console.log('type', type);
    setValue(`formFields[${index}].dataType`, type);
  };

  return (
    <div className="flex flex-col gap-3 px-5 pt-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full">
          <Button
            size={'md'}
            color={'default'}
            shape={'square'}
            className="flex w-full flex-row items-center justify-between gap-1 font-normal"
            endIcon={<ChevronDown className="h-4 w-4" />}
          >
            {inputTypes.find((type) => type.type === current)?.label ||
              'Select input type'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] dark:border-neutral-800  dark:bg-neutral-900 ">
          {inputTypes.map((type) => {
            return (
              <DropdownMenuItem
                key={type.type}
                onClick={() => {
                  onTypeChange(type.type);
                }}
              >
                <div className="flex flex-row items-center gap-2">
                  <Typography className="text-primary-500-main ">
                    {type.label}
                  </Typography>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const FieldOptions = ({
  field,
  index,
  disableParentDrag,
  enableParentDrag,
}: {
  field: any;
  index: number;
  disableParentDrag: () => void;
  enableParentDrag: () => void;
}) => {
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

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    swap(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex w-full flex-col">
        <Droppable droppableId={`droppable-${field.id}`}>
          {(droppableProvider) => (
            <ul
              ref={droppableProvider.innerRef}
              className="flex w-full flex-col py-2"
              {...droppableProvider.droppableProps}
              onMouseEnter={disableParentDrag}
              onMouseLeave={enableParentDrag}
            >
              {fields.map((option: any, optionIndex) => {
                const disabled =
                  hasOtherOption && option?.['value'] === 'Other';
                return (
                  <Draggable
                    key={option.id}
                    draggableId={`${option.id}`}
                    index={optionIndex}
                  >
                    {(draggableProvider) => (
                      <li
                        ref={draggableProvider.innerRef}
                        {...draggableProvider.draggableProps}
                        {...draggableProvider.dragHandleProps}
                        className={cn(
                          'flex w-full flex-row items-start  justify-between gap-2  px-5  py-2 ',
                          'field' + field.id,
                        )}
                      >
                        <RHFInputField
                          name={`formFields[${index}].options[${optionIndex}].value`}
                          formItemProps={{ className: 'w-full' }}
                          inputProps={{
                            placeholder: 'Enter field name',
                            className: cn(
                              'capitalize',
                              disabled && 'bg-neutral-50',
                            ),
                            disabled,
                            leftElement: (
                              <>
                                <GripVertical
                                  size={20}
                                  className="text-neutral-600"
                                />
                                <Circle className="size-5 fill-neutral-100 stroke-none" />
                              </>
                            ),
                            rightElement: (
                              <>
                                <Button.Icon
                                  variant="ghost"
                                  color="default"
                                  size="xs"
                                >
                                  <ImageIcon />
                                </Button.Icon>
                                <Button.Icon
                                  variant="ghost"
                                  color="error"
                                  size="xs"
                                  onClick={() => remove(optionIndex)}
                                >
                                  <Trash2 />
                                </Button.Icon>
                              </>
                            ),
                            wrapperProps: {
                              className: 'flex flex-row gap-2 items-center',
                            },
                          }}
                        />
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {droppableProvider.placeholder}
            </ul>
          )}
        </Droppable>
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
              'flex items-center gap-2',
              hasOtherOption ? 'hidden' : 'visible',
            )}
          >
            Add &ldquo;Other&ldquo; Option
          </Button>
        </div>
      </div>
    </DragDropContext>
  );
};

const RenderField = ({
  field,
  index,
  expand,
}: {
  field: any;
  index: number;
  expand?: boolean;
}) => {
  const { control, watch } = useFormContext();
  const { type, required, options, name } = field || {};
  const [dragable, setDragable] = React.useState(true);
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
  const previewContent =
    watch(`formFields[${index}].label`) || 'Your question here';
  return (
    <Draggable
      key={field.id}
      draggableId={field.id}
      index={index}
      isDragDisabled={!dragable}
    >
      {(draggableProvider) => (
        <li
          ref={draggableProvider.innerRef}
          {...draggableProvider.draggableProps}
          {...draggableProvider.dragHandleProps}
          className="h-fit w-full rounded-xl border "
        >
          <AccordionItem
            key={field.id}
            value={field.id}
            id={'field' + field.id}
          >
            <div
              className={cn(
                'flex  w-full flex-row items-center justify-between gap-2',
                'rounded-t-xl  bg-primary-100 px-5 text-left text-base hover:no-underline dark:bg-neutral-800 md:text-lg  ',
                'field' + field.id,
              )}
            >
              <div className="flex flex-row items-center gap-2">
                <GripVertical size={20} className="text-neutral-600" />
                {cloneElement(typeIcons[type as FormFieldType] || <Type />, {
                  className: 'text-primary-500-main font-semibold size-6',
                })}
                <Typography className="text-primary-500-main ">
                  {fieldOptions.find((option) => option.value === type)?.label}
                </Typography>
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
                <AccordionTrigger
                  className="flex flex-row items-center gap-2"
                  icon={
                    <ChevronDown
                      size={16}
                      className="transition-transform duration-300 group-data-[state=open]:rotate-180"
                    />
                  }
                />
              </div>
            </div>
            <AccordionContent className="space-y-3 py-5 text-base">
              <div className="flex flex-col gap-2 px-5">
                <RHFInputField
                  name={`formFields[${index}].name`}
                  formLabel="Data-name"
                  formItemProps={{
                    className: 'w-full',
                  }}
                  inputProps={{
                    placeholder: 'Enter field name',
                    className: '',
                  }}
                />
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
              </div>
              {type === 'checkbox' || type === 'radio' ? (
                <FieldOptions
                  field={field}
                  index={index}
                  disableParentDrag={() => setDragable(false)}
                  enableParentDrag={() => setDragable(true)}
                />
              ) : null}
              {type === 'input' && (
                <TypeSelection field={field} index={index} />
              )}
            </AccordionContent>
          </AccordionItem>

          {!expand && (
            <div className="p-2 transition-all delay-200">
              <pre>{previewContent}</pre>
            </div>
          )}
        </li>
      )}
    </Draggable>
  );
};

function ArrayFields() {
  const { control, register } = useFormContext(); // retrieve all hook methods
  const [open, setOpen] = React.useState(false);
  const [accordionStatus, setAccordionStatus] = React.useState({});
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: 'formFields',
    },
  );
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    swap(result.source.index, result.destination.index);
  };

  return (
    <div className="flex h-auto w-full flex-col gap-2">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={`droppable-formFields`}>
          {(droppableProvider) => (
            <ul
              ref={droppableProvider.innerRef}
              className="flex w-full flex-col gap-3"
              {...droppableProvider.droppableProps}
            >
              <Accordion
                type="multiple"
                className="flex flex-col gap-5"
                onValueChange={({ ...props }) => {
                  console.log('props', props);
                  setAccordionStatus({ ...props });
                }}
                defaultChecked
              >
                {fields.map((field, index) => (
                  <RenderField
                    key={field.id}
                    field={field}
                    index={index}
                    expand={Object.values(accordionStatus).includes(field.id)}
                  />
                ))}
              </Accordion>
              {droppableProvider.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
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
                  name: `${option.label}`,
                  type: option.value,
                  required: false,
                  options: [],
                });
                setOpen(false);
              }}
              className="flex h-10 w-full flex-row justify-start gap-2"
              shape={'square'}
            >
              {cloneElement(typeIcons[option.value as keyof typeof typeIcons], {
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
