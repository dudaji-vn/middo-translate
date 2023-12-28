import {
  AlertCircleIcon,
  CheckCircle2,
  EyeIcon,
  EyeOffIcon,
} from 'lucide-react';
import { useId, useState } from 'react';

interface InputFieldProps {
  label?: string;
  subLabel?: string;
  placeholder?: string;
  register?: any;
  errors?: any;
  type?: string;
  className?: string;
  isDirty?: boolean;
  isTouched?: boolean;
}

export const InputField = (props: InputFieldProps) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const id = useId();
  const {
    label,
    subLabel,
    placeholder,
    register,
    errors,
    type,
    className,
    isTouched,
  } = props;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-2 ml-5 inline-block" htmlFor={id}>
          {label}
        </label>
      )}
      {subLabel && (
        <span className="mb-2 block max-w-[460px] break-words pl-5 text-sm opacity-60">
          {subLabel}
        </span>
      )}
      <div
        className={`flex h-[50px] w-full items-center justify-start rounded-full border px-4 
                ${errors ? 'border-error-2' : ''} 
                ${
                  type === 'password'
                    ? isTouched && !errors
                      ? 'pr-4'
                      : 'pr-1'
                    : ''
                }  
                ${isTouched && !errors ? 'border-green-500' : ''}`}
      >
        <input
          {...register}
          className="w-full px-1 ring-0 focus:outline-none focus:ring-offset-0 focus-visible:ring-0"
          type={
            type !== 'password' ? type : isShowPassword ? 'text' : 'password'
          }
          id={id}
          spellCheck="false"
          placeholder={placeholder}
        />
        {type === 'password' && (
          <div
            onClick={() => setIsShowPassword(!isShowPassword)}
            className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-transparent p-0 text-sm  font-semibold text-primary ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:!bg-transparent disabled:!opacity-30 md:hover:bg-slate-200"
          >
            {isShowPassword ? (
              <EyeIcon className="text-slate-600 opacity-60" />
            ) : (
              <EyeOffIcon className="text-slate-600 opacity-60" />
            )}
          </div>
        )}
        {isTouched && !errors && (
          <CheckCircle2
            className={`h-5 min-h-[20px] w-5 min-w-[20px] text-success-2`}
          />
        )}
      </div>
      {errors && (
        <div className="mt-2 flex items-center gap-2 pl-5 text-[14px] text-error-2">
          <AlertCircleIcon className="h-7 w-5 min-w-[20px] " />
          {(errors?.message?.message as string) || (errors?.message as string)}
        </div>
      )}
    </div>
  );
};
