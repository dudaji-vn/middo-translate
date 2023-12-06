import Image from 'next/image';
import { Media } from '@/types';
import { forwardRef } from 'react';

export interface ImgGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  images: Media[];
}

export const ImgGallery = forwardRef<HTMLDivElement, ImgGalleryProps>(
  ({ images, ...props }, ref) => {
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
            className="grid max-w-[22.5rem] gap-2"
            style={{
              gridTemplateColumns: `repeat(${num}, minmax(0, 1fr))`,
            }}
          >
            {images.map((img, index) => {
              return (
                <div
                  key={index}
                  style={{
                    width,
                    height: width,
                  }}
                  className="overflow-hidden rounded-md shadow hover:shadow-xl"
                >
                  <Image
                    width={500}
                    height={500}
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
  },
);
ImgGallery.displayName = 'ImgGallery';
