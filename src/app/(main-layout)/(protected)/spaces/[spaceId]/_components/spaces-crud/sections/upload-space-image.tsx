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

import { Button } from '@/components/actions';
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

export default function UploadSpaceImage() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputCropImage = useRef<InputCropImageRef>(null);
  const { t } = useTranslation("common");
  const {
    setValue, watch, formState: { errors },
  } = useFormContext();
  const namefield = `avatar`;
  const avatar = watch(namefield);
  const onUploadedImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const file = inputCropImage.current?.getCropData();
    if (!file) {
      toast.error(t('MESSAGE.ERROR.NOT_CHOOSE_IMAGE'));
      return;
    }
    try {
      let image = await uploadImage(file);
      let imgUrl = image.secure_url;
      if (!imgUrl) throw new Error(t('MESSAGE.ERROR.UPLOAD_IMAGE'));
      setValue(namefield, imgUrl);
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    }
    setIsLoading(false);
  };
  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        {avatar ? <div className='w-fit h-fit relative'>
          <Avatar src={watch('avatar')} alt='avatar' className='w-24 h-24 cursor-pointer p-0' />
          <Button
            className='absolute top-0 right-1 p-1 m-0'
            onClick={() => {
              setValue(namefield, undefined);
            }}
            color={'default'}
          >
            <XIcon size={14} />
          </Button>
        </div> :
          <AlertDialogTrigger>
            <Avatar src={'/empty-cam.svg'}
              alt='avatar'
              className={cn('w-24 h-24 cursor-pointer p-0',
                errors[namefield] && 'border border-red-500'
              )} />
          </AlertDialogTrigger>}
        <AlertDialogContent className="md:h-[80vh] md:max-w-[80vw] xl:max-w-[70vw]">
          <MediaUploadProvider>
            <MediaUploadDropzone>
              <h3 className="text-[24px]">Upload space Image</h3>
              <InputCropImage ref={inputCropImage} open={open} isLoading={isLoading} saveBtnProps={{
                type: 'button',
                onClick: onUploadedImage,
                loading: isLoading,
                children: "Ok",
              }} />
            </MediaUploadDropzone>
          </MediaUploadProvider>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
