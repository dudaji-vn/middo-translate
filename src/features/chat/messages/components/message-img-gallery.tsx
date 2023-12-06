import Image from 'next/image';
import { Media } from '../types';
import { forwardRef } from 'react';

export interface MessageImgGalleryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  images: Media[];
}

export const MessageImgGallery = forwardRef<
  HTMLDivElement,
  MessageImgGalleryProps
>(({ images, ...props }, ref) => {
  const length = images.length;
  const isMultiple = length > 1;
  const num = length > 3 ? 3 : length;
  const width = 360 / num;
  return (
    <>
      {isMultiple ? (
        <div
          ref={ref}
          {...props}
          className="grid max-w-[22.5rem] gap-1"
          style={{
            gridTemplateColumns: `repeat(${num}, minmax(0, 1fr))`,
          }}
        >
          {images.map((img, index) => {
            return (
              <div key={index} className="shadow">
                <Image
                  width={width}
                  height={width}
                  src={img.url}
                  alt="img"
                  className="aspect-square rounded-md"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <Image
          width={280}
          height={280}
          src={images[0].url}
          alt="img"
          className="rounded-md"
        />
      )}
    </>
  );
});
MessageImgGallery.displayName = 'MessageImgGallery';
