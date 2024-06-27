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
import toast from 'react-hot-toast';
import { updateInfoUserService } from '@/services/user.service';
import { uploadImage } from '@/utils/upload-img';
import { useAuthStore } from '@/stores/auth.store';
import {
  MediaUploadDropzone,
  MediaUploadProvider,
} from '@/components/media-upload';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Avatar } from '@/components/data-display';
import { cn } from '@/utils/cn';
import { clear } from 'console';
import customToast from '@/utils/custom-toast';
import { useAppStore } from '@/stores/app.store';

export default function UploadStationImage({
  nameField,
  onUploadDone,
  clearBtnProps,
  clearAble = true,
  uploadAble = false,
  uploadBtnProps,
}: {
  nameField: string;
  clearBtnProps?: ButtonProps;
  uploadBtnProps?: ButtonProps;
  clearAble?: boolean;
  uploadAble?: boolean;
  onUploadDone?: () => void;
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
  const avatar = watch(nameField);
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
        {avatar ? (
          <div className="relative flex h-fit w-fit flex-col gap-1">
            <Avatar
              variant={'outline'}
              src={watch('avatar')}
              alt="avatar"
              className="size-[100px] cursor-pointer p-0 md:size-[132px]"
            />
            <Button.Icon
              className={clearAble ? 'absolute right-0 top-0 m-0' : 'hidden'}
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
          <AlertDialogTrigger className="relative">
            <Avatar
              variant={'outline'}
              src={theme == 'dark' ? '/empty-cam-dark.svg' : '/empty-cam.svg'}
              alt="avatar"
              className={cn(
                'z-0 h-24 w-24 cursor-pointer p-0',
                errors[nameField] &&
                  'border border-red-500 dark:bg-neutral-800',
              )}
            />
          </AlertDialogTrigger>
        )}
        <AlertDialogContent className="md:h-[80vh] md:max-w-[80vw] xl:max-w-[70vw]">
          <MediaUploadProvider>
            <MediaUploadDropzone>
              <h3 className="text-[24px]">
                {t('STATION.UPLOAD_IMAGE')}
              </h3>
              <InputCropImage
                ref={inputCropImage}
                open={open}
                isLoading={isLoading}
                saveBtnProps={{
                  type: 'button',
                  onClick: onUploadedImage,
                  loading: isLoading,
                }}
              />
            </MediaUploadDropzone>
          </MediaUploadProvider>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
