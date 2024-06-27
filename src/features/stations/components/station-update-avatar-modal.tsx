'use client';

import { AlertDialog, AlertDialogContent } from '@/components/feedback';
import {
  InputCropImage,
  InputCropImageRef,
} from '@/components/form/Input-crop-image';
import { useRef, useState } from 'react';

import {
  MediaUploadDropzone,
  MediaUploadProvider,
} from '@/components/media-upload';
import customToast from '@/utils/custom-toast';
import { uploadImage } from '@/utils/upload-img';
import { useTranslation } from 'react-i18next';
import { Station } from '../types/station.types';
import { useUpdateStation } from '../hooks/use-update-station';

export default function StationUpdateAvatar({
  station,
  onClosed,
}: {
  station: Station;
  onClosed?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const inputCropImage = useRef<InputCropImageRef>(null);
  const { t } = useTranslation('common');
  const { mutate } = useUpdateStation();

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
      mutate({
        stationId: station._id,
        data: {
          avatar: imgUrl,
        },
      });
      if (onClosed) {
        onClosed();
      }
    } catch (err: any) {
      customToast.error(err?.response?.data?.message);
    }
    setIsLoading(false);
  };
  return (
    <>
      <AlertDialog
        defaultOpen={true}
        onOpenChange={(open) => {
          if (!open) {
            onClosed?.();
          }
        }}
      >
        <AlertDialogContent className="md:h-[80vh] md:max-w-[80vw] xl:max-w-[70vw]">
          <MediaUploadProvider>
            <MediaUploadDropzone>
              <h3 className="text-[24px]">{t('STATION.UPLOAD_IMAGE')}</h3>
              <InputCropImage
                open={true}
                ref={inputCropImage}
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
