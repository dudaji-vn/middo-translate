'use client';

import React, { cloneElement, useEffect, useMemo } from 'react';
import { FieldError, useFieldArray, useFormContext } from 'react-hook-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/data-display';

import { cn } from '@/utils/cn';
import { Button, CopyZoneClick } from '@/components/actions';
import {
  ChevronDown,
  Circle,
  CopyCheck,
  CopyIcon,
  GripVertical,
  ImageIcon,
  MoreVertical,
  Plus,
  SquareCheck,
  Trash2,
  Type,
  X,
} from 'lucide-react';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/data-display/accordion';
import { Typography } from '@/components/data-display';
import { FormFieldDataTypes, FormFieldType } from './schema';
import { Switch } from '@/components/data-entry';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { isEmpty, isEqual } from 'lodash';
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RHFFormItem } from '@/components/form/RHF/RHFFormItem';
import RHFImageInput from '@/components/form/RHF/RHFImageInput/RHFImageInput';
import { MediaItem } from '@/features/chat/messages/components/message-editor/attachment-selection';
import Image from 'next/image';
import { t } from 'i18next';
import { type } from 'os';
import { RadioItem } from '@radix-ui/react-dropdown-menu';
import { useAppStore } from '@/stores/app.store';

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
  checkbox: <CopyCheck size={20} />,
  radio: <SquareCheck size={20} />,
};

const TypeSelection = ({
  field,
  index,
  viewOnly = false,
}: {
  field: any;
  index: number;
  viewOnly?: boolean;
}) => {
  const { setValue, watch, control, formState } = useFormContext();

  const inputTypes: Array<{ type: FormFieldDataTypes; label: string }> = [
    {
      type: 'text',
      label: 'Plain Text',
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
  if (viewOnly) {
    return (
      <div className="flex flex-col  gap-5 px-5">
        <Typography className="capitalize">Answer Type</Typography>
        <Typography className="px-5 capitalize text-neutral-400">
          {inputTypes.find((type) => type.type === current)?.label}
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-5 ">
      <FormField
        name={`formFields[${index}].dataType`}
        control={control}
        render={({ field, fieldState: { invalid } }) => {
          return (
            <RHFFormItem formLabel={'Answer Type'}>
              <FormControl>
                <DropdownMenu
                  {...{
                    ...field,
                    isError: invalid,
                  }}
                >
                  <DropdownMenuTrigger disabled={viewOnly} className="w-full">
                    <Button
                      size={'md'}
                      color={'default'}
                      shape={'square'}
                      className="flex w-full flex-row items-center justify-between gap-1 font-normal"
                      endIcon={<ChevronDown className="h-4 w-4" />}
                    >
                      {inputTypes.find((type) => type.type === current)
                        ?.label || 'Select input type'}
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
                            <Typography className="font-semibold ">
                              {type.label}
                            </Typography>
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
            </RHFFormItem>
          );
        }}
      />
    </div>
  );
};

const FieldOptions = ({
  field,
  index,
  disableParentDrag,
  enableParentDrag,
  viewOnly = false,
}: {
  field: any;
  index: number;
  disableParentDrag: () => void;
  enableParentDrag: () => void;
  viewOnly?: boolean;
}) => {
  const { control, formState, watch } = useFormContext();
  const { fields, append, remove, swap, update } = useFieldArray({
    control,
    name: `formFields[${index}].options`,
  });

  const hasOtherOption = useMemo(
    () => fields.some((option: any) => option?.['value'] === 'other'),
    [fields],
  );

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    swap(result.source.index, result.destination.index);
  };

  const optionsErrorMessage = (formState.errors?.formFields as any)?.[index]
    ?.options?.message;

  if (viewOnly) {
    return (
      <div className="flex w-full flex-col">
        <ul className="flex w-full flex-col py-2">
          {fields.map((option: any, optionIndex) => {
            const disabled = hasOtherOption && option?.['value'] === 'other';
            const alreadyHasImage = !!option?.['image'];
            const canHaveImage =
              option?.['value'] !== 'other' && !alreadyHasImage;
            const media = watch(
              `formFields[${index}].options[${optionIndex}].media`,
            );

            return (
              <li
                key={option.id}
                className={cn(
                  'flex w-full flex-col items-start  justify-between gap-2  px-10  py-2 ',
                  'field' + field.id,
                )}
              >
                <div className="flex flex-row items-center gap-2">
                  <Circle className="size-5 fill-neutral-100 stroke-none" />
                  <Typography className="capitalize">{option.value}</Typography>
                </div>
                {media && (
                  <div className="relative ml-14 flex aspect-square w-20 rounded-lg">
                    <Image
                      src={media}
                      alt={`Option ${optionIndex + 1} image`}
                      key={media}
                      width={40}
                      height={40}
                      quality={100}
                      className="size-full rounded-lg"
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

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
                  hasOtherOption && option?.['value'] === 'other';
                const alreadyHasImage = !!option?.['image'];
                const canHaveImage =
                  option?.['value'] !== 'other' && !alreadyHasImage;
                const media = watch(
                  `formFields[${index}].options[${optionIndex}].media`,
                );
                console.log('media', media);
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
                          'flex w-full flex-col items-start  justify-between gap-2  px-5  py-2 ',
                          'field' + field.id,
                        )}
                      >
                        <RHFInputField
                          name={`formFields[${index}].options[${optionIndex}].value`}
                          formItemProps={{ className: 'w-full' }}
                          inputProps={{
                            placeholder: 'Enter option',
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
                                {canHaveImage && (
                                  <RHFImageInput
                                    nameField={`formFields[${index}].options[${optionIndex}].media`}
                                    onUploadDone={() => {}}
                                    cropperProps={{
                                      className: '',
                                      aspectRatio: 1,
                                      initialAspectRatio: 1,
                                    }}
                                    previewProps={{
                                      className: 'hidden',
                                    }}
                                  >
                                    <Button.Icon
                                      variant="ghost"
                                      color="default"
                                      size="xs"
                                    >
                                      <ImageIcon />
                                    </Button.Icon>
                                  </RHFImageInput>
                                )}

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
                        {media && (
                          <div className="relative ml-14 flex aspect-square w-20 rounded-lg">
                            <Image
                              src={media}
                              alt={`Option ${optionIndex + 1} image`}
                              key={media}
                              width={40}
                              height={40}
                              quality={100}
                              className="size-full rounded-lg"
                            />
                            <Button.Icon
                              variant="default"
                              color={'default'}
                              size="ss"
                              className="absolute right-1 top-1"
                              onClick={() => {
                                update(optionIndex, {
                                  value: option.value,
                                  media: null,
                                });
                              }}
                            >
                              <X />
                            </Button.Icon>
                          </div>
                        )}
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {droppableProvider.placeholder}
            </ul>
          )}
        </Droppable>
        <div className="flex flex-col md:flex-row gap-2 max-md:px-6">
          <div className="invisible md:w-6" />
          <Button
            onClick={() => append({ value: '', type: 'default' })}
            color={'secondary'}
            shape={'square'}
            size={'xs'}
            startIcon={<Plus size={18} />}
          >
            Add Option
          </Button>
          <Button
            onClick={() => append({ value: 'other', type: 'other' })}
            color={'default'}
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
      <FormMessage
        className={cn('text-normal pl-4 text-left font-normal text-red-500', {
          hidden: !optionsErrorMessage,
        })}
      >
        {String(optionsErrorMessage)}
      </FormMessage>
    </DragDropContext>
  );
};
const MoreActions = ({
  viewOnly,
  name,
  index,
  onRemoveField = () => {},
  ...props
}: {
  viewOnly?: boolean;
  name: string;
  index: number;
  onRemoveField?: () => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const isMobile = useAppStore((state) => state.isMobile);

  const { setValue, watch } = useFormContext();

  if (!isMobile) {
    return (
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-row items-center gap-2 text-neutral-600">
          <Typography>Required</Typography>
          <Switch
            checked={watch(`formFields[${index}].required`)}
            disabled={viewOnly}
            onCheckedChange={(value) => {
              setValue(`formFields[${index}].required`, value);
            }}
          />
        </div>
        <CopyZoneClick text={name} className={viewOnly ? 'hidden' : 'visible'}>
          <Button.Icon
            disabled={!name}
            variant="ghost"
            color="primary"
            size="xs"
          >
            <CopyIcon />
          </Button.Icon>
        </CopyZoneClick>
        <Button.Icon
          variant="ghost"
          color="error"
          size="xs"
          onClick={onRemoveField}
          className={viewOnly ? 'hidden' : 'visible'}
        >
          <Trash2 />
        </Button.Icon>
      </div>
    );
  }
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Button.Icon size="xs" variant="ghost" color="default">
          <MoreVertical />
        </Button.Icon>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark:border-neutral-800 dark:bg-neutral-900 [&_svg]:size-5">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className="flex flex-row items-center  justify-between    gap-3"
        >
          <Typography>Required</Typography>
          <Switch
            checked={watch(`formFields[${index}].required`)}
            onCheckedChange={(value) => {
              setValue(`formFields[${index}].required`, value);
            }}
          />
        </DropdownMenuItem>
        <CopyZoneClick text={name}>
          <DropdownMenuItem
            className={'flex flex-row items-center justify-between  gap-3 '}
          >
            <Typography>Copy</Typography>
            <CopyIcon />
          </DropdownMenuItem>
        </CopyZoneClick>
        <DropdownMenuItem
          onClick={onRemoveField}
          className={
            viewOnly
              ? 'hidden'
              : 'flex flex-row items-center justify-between   gap-3'
          }
        >
          <Typography>Remove</Typography>
          <Trash2 size={20} className="text-error" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const RenderField = ({
  field,
  index,
  expand,
  viewOnly = false,
  onRemoveField,
}: {
  field: any;
  index: number;
  expand?: boolean;
  onRemoveField?: () => void;
  viewOnly?: boolean;
}) => {
  const { control, watch, setValue, formState } = useFormContext();
  const { type, name } = field || {};
  const [dragable, setDragable] = React.useState(true);
  const hasErrors = useMemo(() => {
    console.log('hasErrors: ', formState.errors);
    return Object.keys(formState.errors).some((key) =>
      key.startsWith(`formFields[${index}]`),
    );
  }, [formState.errors, index]);
  const previewContent =
    watch(`formFields[${index}].label`) || 'Your question here';
  return (
    <Draggable
      key={field.id}
      draggableId={field.id}
      index={index}
      isDragDisabled={!dragable || viewOnly}
    >
      {(draggableProvider) => (
        <li
          ref={draggableProvider.innerRef}
          {...draggableProvider.draggableProps}
          {...draggableProvider.dragHandleProps}
          className="h-fit w-full rounded-xl border"
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
                <MoreActions
                  name={name}
                  index={index}
                  onRemoveField={onRemoveField}
                />
                <AccordionTrigger
                  className="flex flex-row items-center gap-2"
                  disabled={hasErrors}
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
                  formItemProps={{
                    className: 'w-full',
                  }}
                  inputProps={{
                    placeholder: 'Enter field name',
                    disabled: viewOnly,
                    className: viewOnly ? 'border-none' : '',
                  }}
                  formLabel="Data-Name"
                />
                <RHFInputField
                  name={`formFields[${index}].label`}
                  formItemProps={{
                    className: 'w-full',
                  }}
                  inputProps={{
                    placeholder: 'What is your question?',
                    disabled: viewOnly,
                    className: viewOnly ? 'border-none' : '',
                  }}
                  formLabel="Label"
                />
                <RHFInputField
                  name={`formFields[${index}].placeholder`}
                  formItemProps={{
                    className: cn('w-full', {
                      hidden:
                        viewOnly && !watch(`formFields[${index}].placeholder`),
                    }),
                  }}
                  inputProps={{
                    placeholder:
                      'Appears below the Label to guide your Collaborators, just like this helper text!',
                    disabled: viewOnly,
                    className: viewOnly ? 'border-none' : '',
                  }}
                  formLabel="Helper Text"
                />
              </div>
              {type === 'checkbox' || type === 'radio' ? (
                <FieldOptions
                  field={field}
                  index={index}
                  viewOnly={viewOnly}
                  disableParentDrag={() => setDragable(false)}
                  enableParentDrag={() => setDragable(true)}
                />
              ) : null}
              {type === 'input' && (
                <TypeSelection
                  viewOnly={viewOnly}
                  field={field}
                  index={index}
                />
              )}
            </AccordionContent>
          </AccordionItem>

          {!expand && (
            <div className="p-2 px-3 transition-all delay-200">
              <pre className=" text-base leading-[18px] tracking-tight text-neutral-800">
                {previewContent}
              </pre>
            </div>
          )}
        </li>
      )}
    </Draggable>
  );
};

function ArrayFields({ viewOnly = false }: { viewOnly?: boolean }) {
  const {
    control,
    register,
    trigger,
    formState: { errors },
  } = useFormContext(); // retrieve all hook methods
  const [openAddingField, setOpenAddingField] = React.useState(false);
  const [accordionStatus, setAccordionStatus] = React.useState<
    'recently-added' | 'recently-removed' | string
  >();

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: 'formFields',
  });

  const hasAnyError =
    fields?.length > 0 &&
    Object.keys(errors).some((key) => key.startsWith('formFields'));

  const isAccordionOpen =
    fields.find((field) => field.id === accordionStatus) &&
    !!accordionStatus?.trim();
  const onOpenAddingField = () => {
    if (accordionStatus) {
      return;
    }
    setOpenAddingField(true);
  };
  const onCloseAddingField = () => {
    setOpenAddingField(false);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    swap(result.source.index, result.destination.index);
  };
  const onAddField = (field: any) => {
    append(field);
    setAccordionStatus('recently-added');
  };
  useEffect(() => {
    if (fields.length > 0 && accordionStatus === 'recently-added') {
      setAccordionStatus(fields[fields.length - 1].id);
    }
  }, [accordionStatus, fields]);

  const handleAccordionChange = (props: string | undefined) => {
    if (!props) {
      const currentField = fields.indexOf(
        // @ts-ignore
        fields.find((field) => field?.id === accordionStatus),
      );
      // @ts-ignore
      const currentErrors = errors?.formFields?.[currentField as number];
      console.log('currentErrors', currentErrors);
      if (!isEmpty(currentErrors)) {
        setAccordionStatus(props);
        return;
      }
      trigger(`formFields[${currentField}]`).then((isValid) => {
        if (isValid) {
          setAccordionStatus(props);
        }
      });
      return;
    }
    setAccordionStatus(props);
  };

  return (
    <div className="flex  max-h-full w-full flex-col gap-2">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={`droppable-formFields`}>
          {(droppableProvider) => (
            <ul
              ref={droppableProvider.innerRef}
              className="flex w-full flex-col gap-3"
              {...droppableProvider.droppableProps}
            >
              <Accordion
                type="single"
                collapsible
                className="flex flex-col gap-5 "
                onValueChange={handleAccordionChange}
                value={accordionStatus}
              >
                {fields.map((field, index) => (
                  <RenderField
                    viewOnly={viewOnly}
                    key={field.id}
                    field={field}
                    index={index}
                    expand={isEqual(accordionStatus, field.id)}
                    onRemoveField={() => {
                      if (isEqual(accordionStatus, field.id)) {
                        setAccordionStatus(undefined);
                      }
                      remove(index);
                    }}
                  />
                ))}
              </Accordion>
              {droppableProvider.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <div
        className={cn('p-2transition-all flex flex-row gap-3 duration-700', {
          hidden: viewOnly,
        })}
        onMouseLeave={onCloseAddingField}
      >
        <Button.Icon
          disabled={isAccordionOpen || hasAnyError}
          variant={'default'}
          color={'secondary'}
          size={'xs'}
          onMouseEnter={onOpenAddingField}
        >
          <Plus
            size={18}
            className={cn(
              'transition-all duration-500',
              openAddingField ? 'rotate-180' : 'rotate-0',
            )}
          />
        </Button.Icon>
        <div onMouseLeave={onCloseAddingField} className="">
          <div
            className={cn(
              'h-auto w-fit origin-top-left space-y-2  rounded-[12px] border border-dashed border-primary-500-main  bg-transparent p-2 shadow-[2px_4px_16px_2px_#1616161A] transition-all  duration-500',
              openAddingField ? 'scale-100' : 'scale-0',
              'absolute  bg-white',
            )}
          >
            {fieldOptions.map((option) => (
              <Button
                key={option.value}
                size={'xs'}
                color="default"
                onClick={() => {
                  onAddField({
                    name: `${option.label}`,
                    type: option.value,
                    dataType: 'text',
                    required: true,
                    options: [],
                  });
                  setOpenAddingField(false);
                }}
                className="flex h-10 w-full flex-row justify-start gap-2"
                shape={'square'}
              >
                {cloneElement(
                  typeIcons[option.value as keyof typeof typeIcons],
                  {
                    className: ' size-5',
                  },
                )}
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArrayFields;
