import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/actions';
import { Circle, CirclePlus, Pen, RefreshCcw } from 'lucide-react';
import { z } from 'zod';
import { useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import RHFInputField from '@/components/form/RHF/RHFInputFields/RHFInputField';
import { Form } from '@/components/ui/form';
import toast from 'react-hot-toast';
import { ConfirmAlertModal } from '@/components/modal/confirm-alert-modal';
import { TConversationTag } from '../../../_components/business-spaces';
import { DEFAULT_THEME } from '../extension-creation/sections/options';
import { createOrEditTag } from '@/services/business-space.service';
import { isEqual } from 'lodash';
import RHFColorSelector, {
  COLOR_REGEX,
} from '@/components/form/RHF-color-selector/rhf-color-selector';
import customToast from '@/utils/custom-toast';

const createOrEditTagSchema = z.object({
  tagId: z.string().optional(),
  name: z
    .string()
    .min(1, {
      message: 'Tag name is required.',
    })
    .max(16, {
      message: 'Tag name is too long, maximum 16 characters.',
    }),
  color: z
    .string()
    .min(1, {
      message: 'Tag color is required.',
    })
    .refine(
      (value) => {
        return COLOR_REGEX.test(value);
      },
      {
        message: 'Tag color should follow the HEX format. (e.g. #FAFAFA)',
      },
    ),
});

export type TCreateOrEditTagFormValues = z.infer<typeof createOrEditTagSchema>;

export const CreateOrEditTag = ({
  open,
  onOpenChange,
  onCreateSuccess,
  initTag,
  spaceId,
  tags,
}: {
  initTag?: TConversationTag;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spaceId: string;
  tags: TConversationTag[];
  onCreateSuccess?: (tags: TConversationTag[]) => void;
}) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const action = initTag ? t('EXTENSION.TAG.EDIT') : t('EXTENSION.TAG.CREATE');
  const methods = useForm<TCreateOrEditTagFormValues>({
    mode: 'onBlur',
    resolver: zodResolver(createOrEditTagSchema),
    defaultValues: initTag
      ? {
          name: initTag.name,
          color: initTag.color,
          tagId: initTag._id,
        }
      : {
          name: '',
          color: DEFAULT_THEME,
        },
  });
  useEffect(() => {
    if (initTag && open) {
      methods.setValue('color', initTag.color);
      methods.setValue('name', initTag.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initTag]);

  const {
    handleSubmit,
    watch,
    formState: { isValid, errors, isSubmitting },
  } = methods;
  const tagColor = watch('color');
  const isTagColorValid = COLOR_REGEX.test(tagColor);

  const onSubmit = async ({ name, color }: TCreateOrEditTagFormValues) => {
    try {
      await createOrEditTag({
        spaceId,
        color,
        name,
        tagId: initTag?._id,
      }).then((res) => {
        if (res.data) {
          customToast.success(
            t(`COMMON.SUCCESS_TO`, { action: action.toLowerCase() }),
          );
          router.refresh();
          onCreateSuccess && onCreateSuccess(res.data);
          onOpenChange(false);
          return;
        }
      });
    } catch (error: unknown) {
      console.log(error);
      // @ts-ignore
      const msg = error?.response?.data?.message || error?.message;
      customToast.error(
        `${t(`COMMON.FAILED_TO`, { action: action.toLowerCase() })}: ${msg}`,
      );
      console.error(error);
    }
  };

  const submitAble =
    isValid &&
    !isEqual(
      {
        name: watch('name'),
        color: watch('color'),
      },
      {
        name: initTag?.name,
        color: initTag?.color,
      },
    );

  return (
    <>
      <Button.Icon
        onClick={() => onOpenChange(true)}
        color={'default'}
        size={'xs'}
      >
        <Pen size={15} />
      </Button.Icon>
      <ConfirmAlertModal
        title={t(`${action}`)}
        open={open}
        onOpenChange={onOpenChange}
        footerProps={{
          className: 'hidden',
        }}
      >
        <Form {...methods}>
          <div className=" max-h-[calc(85vh-48px)] max-w-screen-md  bg-white dark:bg-background  [&_h3]:mt-4 [&_h3]:text-[1.25rem]">
            <div className="flex w-full flex-col gap-3">
              <div className="flex w-full flex-row items-center gap-3 rounded-[12px]">
                <RHFInputField
                  name="name"
                  formItemProps={{
                    className: 'w-full',
                  }}
                  inputProps={{
                    placeholder: 'Enter tag name',
                  }}
                />
              </div>
              <RHFColorSelector
                colorNameFiled="color"
                selectedColor={tagColor}
              />
              <div className="flex w-full flex-row items-center justify-end gap-3">
                <Button
                  onClick={() => onOpenChange(false)}
                  color={'default'}
                  shape={'square'}
                  size={'sm'}
                >
                  {t('COMMON.CANCEL')}
                </Button>
                <Button
                  type="button"
                  color={'primary'}
                  shape={'square'}
                  size={'sm'}
                  onClick={() => {
                    handleSubmit(onSubmit)();
                    onOpenChange(false);
                  }}
                  loading={isSubmitting}
                  disabled={!submitAble}
                >
                  {t('COMMON.SAVE')}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </ConfirmAlertModal>
    </>
  );
};
