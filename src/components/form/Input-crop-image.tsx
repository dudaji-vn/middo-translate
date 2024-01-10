import 'cropperjs/dist/cropper.css';

import Cropper, { ReactCropperElement } from 'react-cropper';
import { RotateCcw, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import {
  createRef,
  forwardRef,
  useId,
  useImperativeHandle,
  useState,
} from 'react';

import { Range } from 'react-range';

interface InputCropImageProps {
  className?: string;
  getImage?: any;
}
export interface InputCropImageRef {
  getCropData: () => null | File;
}
export const InputCropImage = forwardRef<
  InputCropImageRef,
  InputCropImageProps
>((props: InputCropImageProps, ref) => {
  const [image, setImage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [zoom, setZoom] = useState<number[]>([1]);
  const cropperRef = createRef<ReactCropperElement>();

  const id = useId();
  const { className } = props;

  const onChange = (e: any) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    if (!files) return;
    if (files[0].size > 1024 * 1024 * 3) {
      // 3MB
      setErrorMessage('File size need to be less than 3MB');
      return;
    }
    const type = files[0].type;
    const typeSplit = type.split('/');
    const fileType = typeSplit[typeSplit.length - 1];
    if (
      fileType !== 'png' &&
      fileType !== 'jpeg' &&
      fileType !== 'jpg' &&
      fileType !== 'gif'
    ) {
      setErrorMessage('File type is not supported');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    reader.readAsDataURL(files[0]);
    setErrorMessage('');
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== 'undefined') {
      let imageBase64 = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL();
      const arr = imageBase64.split(',');
      const mime = arr[0].match(/:(.*?);/)![1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
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
    <div className={className}>
      {!image && (
        <label
          htmlFor={id}
          className="mb-6 mt-5 flex border-spacing-3 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-primary p-4 py-[70px] transition-all hover:bg-slate-50"
        >
          <span className="rounded-full bg-blue-200 p-4">
            <Upload width={24} height={24} className="stroke-primary" />
          </span>
          <span className="mt-[10px] font-normal">Upload Image</span>
        </label>
      )}
      <input
        type="file"
        onChange={onChange}
        hidden
        id={id}
        accept="image/png, image/gif, image/jpeg"
      />
      {image && (
        <div className="relative mt-3 rounded-lg">
          <label
            htmlFor={id}
            className="z-100 absolute right-0 top-[-50px] block w-fit cursor-pointer rounded-full p-3 transition-all hover:bg-slate-100"
          >
            <RotateCcw />
          </label>
          <div className="overflow-hidden rounded-md">
            <Cropper
              className="crop-container"
              ref={cropperRef}
              style={{ height: 400, width: '100%' }}
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
  );
});
InputCropImage.displayName = 'InputCropImage';
