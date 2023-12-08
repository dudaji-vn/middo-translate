import { createRef, forwardRef, useId, useImperativeHandle, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { RotateCcw, Upload, ZoomIn, ZoomOut } from "lucide-react";
import { Range } from 'react-range';

interface InputCropImageProps {
    className?: string;
    getImage?: any;
}
export interface InputCropImageRef {
    getCropData: () => null | File;
}
export const InputCropImage = forwardRef<InputCropImageRef, InputCropImageProps>(
    ( props: InputCropImageProps, ref) => {
    const [image, setImage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
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
        if(!files) return;
        if(files[0].size > 1024 * 1024 * 3) { // 3MB
            setErrorMessage('File size need to be less than 3MB');
            return;
        }
        const type = files[0].type;
        const typeSplit = type.split('/');
        const fileType = typeSplit[typeSplit.length - 1];
        if(fileType !== 'png' && fileType !== 'jpeg' && fileType !== 'jpg' && fileType !== 'gif') {
            setErrorMessage('File type is not supported');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result as any);
        };
        reader.readAsDataURL(files[0]);
        setErrorMessage("");
    };

    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            let imageBase64 = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
            const arr = imageBase64.split(',');
            const mime = arr[0].match(/:(.*?);/)![1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            const file = new File([u8arr], 'avatar', {type:mime});
            return file;
        }
        return null;
    };

    const handleZoom = ({type: zoomType}: {type: string}) => {
        const currentZoom = cropperRef.current?.cropper?.getData();
        if(zoomType === 'in' && currentZoom) {
            const { scaleX, scaleY } = currentZoom;
            if(scaleX >= 2 || scaleY >= 2) return false;
            cropperRef.current?.cropper?.scaleX(scaleX + 0.1);
            cropperRef.current?.cropper?.scaleY(scaleY + 0.1);
            setZoom([scaleX + 0.1])
        } else if(zoomType === 'out' && currentZoom) {
            const { scaleX, scaleY } = currentZoom;
            if(scaleX <= 1 || scaleY <= 1) return false;
            cropperRef.current?.cropper?.scaleX(scaleX - 0.1);
            cropperRef.current?.cropper?.scaleY(scaleY - 0.1);
            setZoom([scaleX - 0.1])
        }
        return true;
    }

    useImperativeHandle(ref, () => ({
        getCropData,
    }));

    return (
        <div className={className}>
            {!image && 
            <label htmlFor={id} className="flex items-center justify-center flex-col p-4 py-[70px] border border-dashed border-primary border-spacing-3 rounded-lg mt-5 mb-6 hover:bg-slate-50 transition-all cursor-pointer">
                <span className="p-4 bg-blue-200 rounded-full"><Upload width={24} height={24} className="stroke-primary"/></span>
                <span className="mt-[10px] font-normal">Upload Image</span>
            </label>}
            <input type="file" onChange={onChange} hidden id={id} accept="image/png, image/gif, image/jpeg"/>
            {image && 
            <div className="rounded-lg mt-3 relative">
                <label htmlFor={id} className="p-3 block w-fit absolute top-[-50px] z-100 right-0 cursor-pointer hover:bg-slate-100 transition-all rounded-full">
                    <RotateCcw />
                </label>
                <div className="overflow-hidden rounded-md">
                    <Cropper
                        className="crop-container"
                        ref={cropperRef}
                        style={{ height: 400, width: "100%" }}
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
                            handleZoom({type});
                        }}
                    />
                </div>
                <div className="flex items-center justify-center max-w-[288px] mx-auto gap-2 mt-5">
                    <button type="button" className="w-12 h-12 flex items-center justify-center" onClick={()=> handleZoom({type: 'out'})}>
                        <ZoomOut width={24} height={24}/>
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
                            <div {...props} className="h-1 w-full bg-gray-200 rounded">
                                {children}
                            </div>
                        )}
                        renderThumb={({ props }) => (
                            <div {...props} className="w-6 h-6 bg-primary rounded-full" key="1"></div>
                        )}
                    />
                    <button type="button" className="w-12 h-12 flex items-center justify-center" onClick={()=> handleZoom({type: 'in'})}>
                        <ZoomIn width={24} height={24}/>
                    </button>
                </div>
            </div>
            }
            {errorMessage && <p className="mt-2 text-error-2 text-sm text-center">{errorMessage}</p>}
        </div>
    )
})
InputCropImage.displayName = 'InputCropImage';