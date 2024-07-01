import Image from 'next/image';
import { Media } from '@/types';
import { forwardRef } from 'react';
import { useMediaLightBoxStore } from '@/stores/media-light-box.store';
export interface ImageGalleryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  images: Media[];
}

export const ImageGallery = forwardRef<HTMLDivElement, ImageGalleryProps>(
  ({ images, ...props }, ref) => {
    const length = images.length;
    const isMultiple = length > 1;
    const num = length > 3 ? 3 : length;
    const width = 360 / num;

    const setIndex = useMediaLightBoxStore((state) => state.setIndex);
    const setFiles = useMediaLightBoxStore((state) => state.setFiles);    
    const openMediaLightBox = (index: number) => {
      setIndex(index)
      setFiles(images.map((img) => ({
        url: img.url,
        type: 'image',
        name: img.name || '',
      })))
    }
    return (
      <>
        {isMultiple ? (
          <div
            ref={ref}
            {...props}
            className="grid gap-x-1 gap-y-1"
            style={{
              gridTemplateColumns: `repeat(${num}, minmax(0, 1fr))`,
            }}
          >
            {images.map((img, index) => {
              return (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    openMediaLightBox(index);
                  }}
                  key={index}
                  style={{
                    width,
                    height: width,
                  }}
                  className="relative cursor-pointer overflow-hidden rounded-xl border aspect-square border-neutral-50 dark:border-neutral-800 max-w-full"
                >
                  <Image
                    priority
                    alt={img.name || img.url}
                    src={img.url}
                    fill
                    quality={50}
                    className="disable-ios-img-tap aspect-square object-cover max-w-full"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="relative h-auto">
            <Image
              priority
              onClick={(e) => {
                e.stopPropagation();
                openMediaLightBox(0);
              }}
              width={280}
              height={280}
              src={images[0].url}
              alt="img"
              className="disable-ios-img-tap cursor-pointer overflow-hidden rounded-[20px] border border-neutral-50 dark:border-neutral-800 md:rounded-[16px]"
            />
          </div>
        )}
      </>
    );
  },
);
ImageGallery.displayName = 'ImageGallery';
