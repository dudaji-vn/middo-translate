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
import { Camera } from 'lucide-react';
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

export default function UploadSpaceImage() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputCropImage = useRef<InputCropImageRef>(null);
  const { t } = useTranslation("common");
  const {
    setValue, watch
  } = useFormContext();
  const namefield = `information.avatar`;
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
  console.log('avatar', avatar)
  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        {avatar ?
          <Avatar src={watch('information.avatar')} alt='avatar' className='w-24 h-24 cursor-pointer p-0' />
          :
          <AlertDialogTrigger>
            <Avatar src={'/empty-cam.svg'} alt='avatar' className='w-24 h-24 cursor-pointer p-0' />
          </AlertDialogTrigger>}
        <AlertDialogContent className="md:h-[80vh] md:max-w-[80vw] xl:max-w-[70vw]">
          <MediaUploadProvider>
            <MediaUploadDropzone>
              <h3 className="text-[24px]">Upload space Image</h3>
              <InputCropImage ref={inputCropImage} open={open} isLoading={isLoading} saveBtnProps={{
                type: 'button',
                onClick: onUploadedImage,
                loading: isLoading,
              }} />
            </MediaUploadDropzone>
          </MediaUploadProvider>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
