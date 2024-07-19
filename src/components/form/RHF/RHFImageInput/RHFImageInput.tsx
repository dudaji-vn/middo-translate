'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/feedback';
import {
  InputCropImage,
  InputCropImageRef,
} from '@/components/form/Input-crop-image';
import { useRef, useState } from 'react';

import { Button, ButtonProps } from '@/components/actions';
import { Camera, XIcon } from 'lucide-react';
import { uploadImage } from '@/utils/upload-img';
import {
  MediaUploadDropzone,
  MediaUploadProvider,
} from '@/components/media-upload';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Typography } from '@/components/data-display';
import { cn } from '@/utils/cn';
import customToast from '@/utils/custom-toast';
import { useAppStore } from '@/stores/app.store';
import Image from 'next/image';
import { ReactCropperProps } from 'react-cropper';

export default function RHFImageInput({
  nameField,
  title = 'Upload Image',
  onUploadDone,
  clearBtnProps,
  clearAble = true,
  uploadAble = false,
  previewProps,
  uploadBtnProps,
  children,
  cropperProps,
}: {
  nameField: string;
  title?: string;
  clearBtnProps?: ButtonProps;
  uploadBtnProps?: ButtonProps;
  clearAble?: boolean;
  uploadAble?: boolean;
  onUploadDone?: () => void;
  previewProps?: React.HTMLProps<HTMLDivElement>;
  children: React.ReactNode;
  cropperProps?: ReactCropperProps;
}) {
  const theme = useAppStore((state) => state.theme);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputCropImage = useRef<InputCropImageRef>(null);
  const { t } = useTranslation('common');
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const image = watch(nameField);
  const onUploadedImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const file = inputCropImage.current?.getCropData();
    if (!file) {
      customToast.error(t('MESSAGE.ERROR.NOT_CHOOSE_IMAGE'));
      return;
    }
    try {
      let image = await uploadImage(file);
      let imgUrl = image.secure_url;
      if (!imgUrl) throw new Error(t('MESSAGE.ERROR.UPLOAD_IMAGE'));
      setValue(nameField, imgUrl);
      if (onUploadDone) {
        onUploadDone();
      }
      setOpen(false);
    } catch (err: any) {
      customToast.error(err?.response?.data?.message);
    }
    setIsLoading(false);
  };
  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        {image ? (
          <div
            {...previewProps}
            className={cn('relative', previewProps?.className)}
          >
            <Image
              src={watch(nameField)}
              alt="preview"
              width={100}
              height={75}
              className="aspect-[4/3] size-full object-cover"
            />
            <Button.Icon
              className={clearAble ? 'absolute right-1 top-1 m-0' : 'hidden'}
              onClick={() => {
                setValue(nameField, undefined);
              }}
              color={'default'}
              size={'xs'}
              {...clearBtnProps}
            >
              <XIcon size={14} />
            </Button.Icon>
            {uploadAble && (
              <AlertDialogTrigger
                className={
                  uploadAble ? 'absolute  bottom-0 right-0 size-fit' : 'hidden'
                }
              >
                <Button.Icon
                  color={'default'}
                  size={'xs'}
                  className="border-[2px] border-primary-100 dark:border-neutral-800"
                  onClick={() => setOpen(true)}
                  {...uploadBtnProps}
                >
                  <Camera />
                </Button.Icon>
              </AlertDialogTrigger>
            )}
          </div>
        ) : (
          <AlertDialogTrigger
            className={cn('relative')}
            onClick={() => setOpen(true)}
          >
            {children}
          </AlertDialogTrigger>
        )}
        <AlertDialogContent className="md:h-[80vh] md:max-w-[80vw] xl:max-w-[70vw]">
          <MediaUploadProvider>
            <MediaUploadDropzone>
              <Typography className="text-xl font-bold text-neutral-800">
                {title}
              </Typography>
              <InputCropImage
                ref={inputCropImage}
                open={open}
                isLoading={isLoading}
                saveBtnProps={{
                  type: 'button',
                  onClick: onUploadedImage,
                  loading: isLoading,
                }}
                cropperProps={cropperProps}
              />
            </MediaUploadDropzone>
          </MediaUploadProvider>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
