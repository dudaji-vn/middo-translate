import { AlertCircleOutline, CheckmarkCircle2, EyeOff2Outline, EyeOutline } from "@easy-eva-icons/react";
import Image from "next/image";
import { useId, useState } from "react";
import { useFieldArray } from "react-hook-form";

interface InputImageProps {
    className?: string;
    register?: any;
    errors?: any;
    setValue?: any;
    field?: string;
}

export const InputImage = ( props: InputImageProps ) => {
    const id = useId();
    const [imageSource, setImageSource] = useState<string | ArrayBuffer | null>('/person.svg');

    const { errors, register, className, setValue, field } = props;
   
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const urlImage = URL.createObjectURL(file);
        setImageSource(urlImage);
        setValue('avatar', file);
    };

    return (
        <div>
            <div className={`mx-auto relative w-[120px] h-[120px] rounded-full ${className}`}>
                <Image
                    src={imageSource as string}
                    alt="avatar"
                    fill
                    priority
                    style={{objectFit:"cover"}}
                    className="rounded-full relative block"
                ></Image>
                <input {...register } onChange={handleFileChange} type="file" id={id} hidden accept="image/png, image/gif, image/jpeg"/>
                <label htmlFor={id} className="w-8 h-8 absolute bottom-0 right-0 rounded-full cursor-pointer hover:opacity-70 transition-all">
                    <Image
                        src='/edit-outline.svg'
                        alt="avatar"
                        fill
                        style={{objectFit:"cover"}}
                        className="rounded-full"
                    ></Image>
                </label>
            </div>
            {errors && (
                <div className="mt-2 flex items-center gap-2 pl-5 text-error-2 justify-center">
                    <AlertCircleOutline className="min-w-[20px] h-7 w-5 " />
                    {errors?.message?.message as string || errors?.message as string}
                </div>
            )}
        </div>
    )
}