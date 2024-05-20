import { cn } from '@/utils/cn';
import {
  AlertCircleIcon,
  CheckCircle2,
  EyeIcon,
  EyeOffIcon,
} from 'lucide-react';
import { useId, useState } from 'react';
import { Button } from '../actions';

export interface InputFieldProps {
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
        <label className="mb-2 inline-block" htmlFor={id}>
          {label}
        </label>
      )}
      {subLabel && (
        <span className="mb-2 block max-w-[460px] break-words text-sm opacity-60">
          {subLabel}
        </span>
      )}
      <div
        className={cn(
          `flex h-[48px] w-full items-center justify-start rounded-xl border px-4 pr-1`,
          isTouched && !errors ? 'border-green-500' : '',
        )}
      >
        <input
          {...register}
          className="w-full px-1 ring-0 focus:outline-none focus:ring-offset-0 focus-visible:ring-0"
          type={type === 'password' && isShowPassword ? 'text' : type || 'text'}
          id={id}
          spellCheck="false"
          placeholder={placeholder}
        />
        {type === 'password' && (
          <Button.Icon
            variant={'ghost'}
            size={'sm'}
            onClick={() => setIsShowPassword(!isShowPassword)}
          >
            {isShowPassword ? (
              <EyeIcon className="text-slate-600 opacity-60" />
            ) : (
              <EyeOffIcon className="text-slate-600 opacity-60" />
            )}
          </Button.Icon>
        )}
      </div>
      {errors && (
        <div className="mt-2 flex items-center gap-1 text-[14px] text-error">
          <AlertCircleIcon size={16} />
          {(errors?.message?.message as string) || (errors?.message as string)}
        </div>
      )}
    </div>
  );
};
