import { cn } from '@/utils/cn';
import {
  AlertCircleIcon,
  CheckCircle2,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  XIcon,
} from 'lucide-react';
import { useId, useState } from 'react';
import { Button } from '../actions';

export interface Pattern {
  pattern: RegExp;
  message: string;
}
export interface InputPasswordPatternProps {
  placeholder?: string;
  register?: any;
  errors?: any;
  className?: string;
  isDirty?: boolean;
  isTouched?: boolean;
  patterns?: Pattern[];
  value?: string;
}

export const InputPasswordPattern = (props: InputPasswordPatternProps) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const id = useId();
  const {
    placeholder,
    register,
    errors,
    className,
    isTouched,
    patterns,
    value,
  } = props;

  return (
    <div className={`w-full ${className}`}>
      <div
        className={cn(
          `flex h-[48px] w-full items-center justify-start rounded-xl border px-4 pr-1`,
          isTouched && !errors ? 'border-green-500' : '',
        )}
      >
        <input
          {...register}
          className="w-full px-1 ring-0 focus:outline-none focus:ring-offset-0 focus-visible:ring-0"
          type={isShowPassword ? 'text' : 'password'}
          id={id}
          spellCheck="false"
          placeholder={placeholder}
        />
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
        {/* {isTouched && !errors && (
          <CheckCircle2
            className={`text-success-2 h-5 min-h-[20px] w-5 min-w-[20px]`}
          />
        )} */}
      </div>
      <ul className="mt-3 flex flex-col gap-3">
        {patterns?.map((pattern, index) => {
          const isValid = pattern.pattern.test(value || '');
          return (
            <li className="flex items-center gap-2" key={index}>
              <div
                className={cn(
                  'inline-block rounded-full bg-neutral-50 p-1 text-neutral-400 transition-all',
                  isValid ? 'bg-green-50 text-green-700' : '',
                )}
              >
                <CheckIcon size={16} />
                {/* {isValid ? <CheckIcon size={16}/> : <XIcon size={16}/>} */}
              </div>
              <span className="font-light text-neutral-600">
                {pattern.message}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
