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
import { PageLoading } from '@/components/loading/page-loading';
import toast from 'react-hot-toast';
import { updateInfoUserService } from '@/services/user.service';
import { uploadImage } from '@/utils/upload-img';
import { useAuthStore } from '@/stores/auth.store';
import {
  MediaUploadDropzone,
  MediaUploadProvider,
} from '@/components/media-upload';
import { useTranslation } from 'react-i18next';

export default function UpdateUserAvatar() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, setData: setDataAuth } = useAuthStore();
  const inputCropImage = useRef<InputCropImageRef>(null);
  const {t} = useTranslation("common");
  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = inputCropImage.current?.getCropData();
    if (!file) {
      toast.error(t('MESSAGE.ERROR.NOT_CHOOSE_IMAGE'));
      return;
    }
    try {
      setLoading(true);
      let image = await uploadImage(file);
      let imgUrl = image.secure_url;
      if (!imgUrl) throw new Error(t('MESSAGE.ERROR.UPLOAD_IMAGE'));
      let res = await updateInfoUserService({ avatar: imgUrl });
      setDataAuth({
        user: {
          ...user,
          avatar: res.data.avatar,
        },
      });
      toast.success(t('MESSAGE.SUCCESS.UPDATED_AVATAR'));
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PageLoading />}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>
          <div className="cursor-pointer transition-all hover:opacity-80">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-200 p-0 font-semibold text-primary ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:bg-primary-400 disabled:pointer-events-none disabled:bg-primary-100 disabled:text-primary-200 disabled:opacity-50 md:hover:bg-primary-300 md:active:bg-primary-400">
              <Camera />
            </div>
            <span className="mt-2 block text-center text-sm font-light">
              {t('ACCOUNT_SETTING.AVATAR')}
            </span>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent className="md:max-w-[80vw] xl:max-w-[70vw]">
          <form
            onSubmit={onSubmitForm}
            className="flex h-full w-full flex-col justify-between"
          >
            <MediaUploadProvider>
              <MediaUploadDropzone>
                <h3 className="text-[24px]">{t('ACCOUNT_SETTING.CHANGE_AVATAR')}</h3>
                <InputCropImage ref={inputCropImage} isLoading={loading} open={open}/>
              </MediaUploadDropzone>
            </MediaUploadProvider>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
