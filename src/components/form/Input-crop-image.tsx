import 'cropperjs/dist/cropper.css';

import Cropper, { ReactCropperElement } from 'react-cropper';
import { RotateCcw, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import {
  createRef,
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useState,
} from 'react';

import { Range } from 'react-range';
import { useMediaUpload } from '@/components/media-upload';
import { cn } from '@/utils/cn';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { Button, ButtonProps } from '@/components/actions';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'react-i18next';

interface InputCropImageProps {
  isLoading?: boolean;
  className?: string;
  getImage?: any;
  open?: boolean;
  saveBtnProps?: ButtonProps;
}

const ALLOWED_FILE_TYPES = [
  'image/png',
  'image/gif',
  'image/jpeg',
  'image/jpg',
];

export interface InputCropImageRef {
  getCropData: () => null | File;
}
export const InputCropImage = forwardRef<
  InputCropImageRef,
  InputCropImageProps
>(({ className, isLoading, open, saveBtnProps, ...props }: InputCropImageProps, ref) => {
  const [image, setImage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [zoom, setZoom] = useState<number[]>([1]);
  const cropperRef = createRef<ReactCropperElement>();
  const { files, removeFile, reset } = useMediaUpload();

  useEffect(() => {  
    if (!open) {
      reset();
      setErrorMessage('');
      return;
    }
    if (!isEmpty(files?.[0])) processImageFiles(files[0]?.file);
  }, [files, open]);

  const {t} = useTranslation("common");

  const id = useId();
  const removeDragData = () => {
    if (files?.[0]) removeFile(files?.[0]);
  };

  const processImageFiles = (file: File) => {
    const { type, size } = file || {};
    if (size > 1024 * 1024 * 3) {
      setErrorMessage(t('MESSAGE.ERROR.FILE_SIZE', {val: '3MB'}));
      removeDragData();
      return;
    }
    if (!ALLOWED_FILE_TYPES.includes(type)) {
      setErrorMessage(t('MESSAGE.ERROR.FILE_NOT_SUPPORTED'));
      removeDragData();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    reader.readAsDataURL(file);
    setErrorMessage('');
  };

  const onImageInputChange = (e: any) => {
    e.preventDefault();
    const files = e?.dataTransfer?.files || e?.target?.files;
    if (!files?.length) return;
    const [file] = files;
    processImageFiles(file);
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== 'undefined') {
      let imageBase64 = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();
      const arr = imageBase64.split(',');
      const mime = arr[0].match(/:(.*?);/)![1];
      const bstr = atob(arr[1]);
      let { length: count } = bstr;
      const u8arr = new Uint8Array(count);
      while (count--) {
        u8arr[count] = bstr.charCodeAt(count);
      }
      const file = new File([u8arr], 'avatar', { type: mime });
      return file;
    }
    return null;
  };

  const handleZoom = ({ type: zoomType }: { type: string }) => {
    const currentZoom = cropperRef.current?.cropper?.getData();
    if (zoomType === 'in' && currentZoom) {
      const { scaleX, scaleY } = currentZoom;
      if (scaleX >= 2 || scaleY >= 2) return false;
      cropperRef.current?.cropper?.scaleX(scaleX + 0.1);
      cropperRef.current?.cropper?.scaleY(scaleY + 0.1);
      setZoom([scaleX + 0.1]);
    } else if (zoomType === 'out' && currentZoom) {
      const { scaleX, scaleY } = currentZoom;
      if (scaleX <= 1 || scaleY <= 1) return false;
      cropperRef.current?.cropper?.scaleX(scaleX - 0.1);
      cropperRef.current?.cropper?.scaleY(scaleY - 0.1);
      setZoom([scaleX - 0.1]);
    }
    return true;
  };

  useImperativeHandle(ref, () => ({
    getCropData,
  }));

  return (
    <>
      <div className={cn('md:relative flex-1 py-5', className)}>
        {!image && (
          <label
            htmlFor={id}
            className="flex border-spacing-3 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-primary p-4 py-[70px] transition-all hover:bg-slate-50 h-full"
          >
            <span className="rounded-full p-4">
              <Upload width={24} height={24} className="stroke-primary" />
            </span>
            <span className="mt-[10px] font-normal">{t("COMMON.UPLOAD_IMAGE")}</span>
          </label>
        )}
        <input
          type="file"
          onChange={onImageInputChange}
          hidden
          id={id}
          accept="image/png, image/gif, image/jpeg"
        />
        {image && (
          <div className="relative rounded-lg">
            <label
              htmlFor={id}
              className="z-100 absolute -top-[50px] right-0 block w-fit cursor-pointer rounded-full p-3 transition-all hover:bg-slate-100 "
            >
              <RotateCcw />
            </label>
            <div className="overflow-hidden rounded-md">
              <Cropper
                className="crop-container"
                ref={cropperRef}
                style={{ height: 330, width: '100%' }}
                initialAspectRatio={1}
                aspectRatio={1}
                src={image}
                viewMode={1}
                cropBoxMovable={false}
                cropBoxResizable={false}
                dragMode="move"
                center={true}
                background={false}
                responsive={false}
                autoCropArea={1}
                highlight={false}
                zoom={(e) => {
                  e.preventDefault();
                  const { oldRatio, ratio } = e.detail;
                  const type = oldRatio > ratio ? 'out' : 'in';
                  handleZoom({ type });
                }}
              />
            </div>

            <div className="mx-auto mt-5 flex max-w-[288px] items-center justify-center gap-2">
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center"
                onClick={() => handleZoom({ type: 'out' })}
              >
                <ZoomOut width={24} height={24} />
              </button>
              <Range
                step={0.1}
                min={1}
                max={2}
                values={zoom}
                onChange={(values) => {
                  cropperRef.current?.cropper?.scaleX(values[0]);
                  cropperRef.current?.cropper?.scaleY(values[0]);
                  setZoom(values);
                }}
                renderTrack={({ props, children }) => (
                  <div {...props} className="h-1 w-full rounded bg-gray-200">
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="h-6 w-6 rounded-full bg-primary"
                    key="1"
                  ></div>
                )}
              />
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center"
                onClick={() => handleZoom({ type: 'in' })}
              >
                <ZoomIn width={24} height={24} />
              </button>
            </div>
          </div>
        )}
        {errorMessage && (
          <p className="mt-2 text-center text-sm text-error">{errorMessage}</p>
        )}
      </div>
      <div className="flex items-center justify-end gap-3">
        <AlertDialogCancel
          onClick={removeDragData}
          className="mr-2 border-0 bg-transparent hover:!border-0 hover:!bg-transparent"
        >
          <p>{t("COMMON.CANCEL")}</p>
        </AlertDialogCancel>
        <Button shape="square" disabled={isLoading} type="submit" {...saveBtnProps}>
          {t("COMMON.SAVE")}
        </Button>
      </div>
    </>
  );
});
InputCropImage.displayName = 'InputCropImage';
