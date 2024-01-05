import { useId, useState } from 'react';

import { AlertCircleIcon } from 'lucide-react';
import Image from 'next/image';

interface InputImageProps {
  className?: string;
  register?: any;
  errors?: any;
  setValue?: any;
  field?: string;
}

export const InputImage = (props: InputImageProps) => {
  const id = useId();
  const [imageSource, setImageSource] = useState<string | ArrayBuffer | null>(
    '/person.svg',
  );

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
      <label
        htmlFor={id}
        className={`relative mx-auto block h-[120px] w-[120px] cursor-pointer rounded-full ${className}`}
      >
        <Image
          src={imageSource as string}
          alt="avatar"
          fill
          priority
          style={{ objectFit: 'cover' }}
          className="relative block rounded-full"
        ></Image>
        <input
          {...register}
          onChange={handleFileChange}
          type="file"
          id={id}
          hidden
          accept="image/png, image/gif, image/jpeg"
        />
        <div className="absolute bottom-0 right-0 h-8 w-8 cursor-pointer rounded-full transition-all hover:opacity-70">
          <Image
            src="/edit-outline.svg"
            alt="avatar"
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-full"
          ></Image>
        </div>
      </label>
      {errors && (
        <div className="mt-2 flex items-center justify-center gap-2 pl-5 text-error">
          <AlertCircleIcon className="h-7 w-5 min-w-[20px] " />
          {(errors?.message?.message as string) || (errors?.message as string)}
        </div>
      )}
    </div>
  );
};
