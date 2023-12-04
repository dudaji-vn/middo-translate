import { AlertCircleOutline, CheckmarkCircle2, EyeOff2Outline, EyeOutline } from "@easy-eva-icons/react";
import { FC, useId, useState } from "react";
import { Button } from "@/components/actions/button";

interface InputFieldProps {
    label?: string;
    subLabel?: string;
    placeholder?: string;
    register?: any;
    errors?: any;
    type?: string;
    className?: string;
    isDirty?: boolean;
}

export const InputField = ( props: InputFieldProps ) => {
    const [isShowPassword, setIsShowPassword] = useState(false);

    const id = useId();
    const { label, subLabel, placeholder, register, errors, type, className, isDirty } = props;

    return (
        <div className={`w-full ${className}`}>
            {label && <label className="mb-2 ml-5 inline-block" htmlFor={id}>{label}</label>}
            {subLabel && <span className="mb-2 block max-w-[460px] break-words pl-5 text-sm opacity-60">{subLabel}</span>}
            <div className={`flex h-[50px] w-full items-center justify-start rounded-full border px-4 ${errors ? 'border-error-2' : ''} ${type === 'password' ? 'pr-1' : ''}`} >
                <input
                    {...register }
                    className="w-full ring-0 focus:outline-none focus:ring-offset-0 focus-visible:ring-0 px-1"
                    type={type !== 'password' ? type : isShowPassword ? 'text' : 'password'}
                    id={id}
                    spellCheck="false"
                    placeholder={placeholder}
                />
                {type === 'password' && (
                    <div
                        onClick={() => setIsShowPassword(!isShowPassword)} 
                        className="font-semibold inline-flex items-center justify-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all focus-visible:ring-offset-2 disabled:pointer-events-none  text-sm rounded-full bg-transparent text-primary md:hover:bg-lighter active:!bg-secondary disabled:!bg-transparent disabled:!opacity-30 shrink-0 p-0 w-11 h-11 cursor-pointer">
                        {isShowPassword ? <EyeOutline className="opacity-60" /> : <EyeOff2Outline className="opacity-60" />}
                    </div>
                )}
                {/* {!errors && (
                    <CheckmarkCircle2 className={`h-5 w-5 min-w-[20px] min-h-[20px] text-success-2`}/>
                )} */}
            </div>
            {errors && (
                <div className="mt-2 flex items-center gap-2 pl-5 text-error-2">
                <AlertCircleOutline className="h-7 w-5" />
                {errors?.message?.message as string}
            </div>
            )}
        </div>
    )
}