import 'yet-another-react-lightbox/plugins/thumbnails';

import * as React from 'react';

import {
  CarouselSettings,
  IconButton,
  ImageSlide,
  ImageSlideProps,
  PluginProps,
  Slide,
  SlideImage,
  addToolbarButton,
  createIcon,
  getSlideIfPresent,
  isImageSlide,
  useLightboxProps,
  useLightboxState,
} from 'yet-another-react-lightbox';

declare module 'yet-another-react-lightbox' {
  interface SlideImage {
    rotate?: number;
  }

  interface LightboxProps {
    rotate?: {
      transition: string | false;
    };
  }
}

const RotateLeft = createIcon(
  'RotateLeft',
  <path d="M7.11 8.53 5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z" />,
);

const RotateRight = createIcon(
  'RotateRight',
  <path d="M15.55 5.55 11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45zM19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42 1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z" />,
);

function isRotateSupported(
  carousel: CarouselSettings,
  slide?: Slide,
): slide is SlideImage {
  return (
    slide !== undefined &&
    isImageSlide(slide) &&
    slide.width !== undefined &&
    slide.height !== undefined &&
    carousel.imageFit !== 'cover'
  );
}

function RotateButton<S extends Slide>({
  setSlides,
  reverse,
}: {
  reverse?: boolean;
  setSlides: React.Dispatch<React.SetStateAction<S[]>>;
}) {
  const { carousel } = useLightboxProps();
  const { slides, currentIndex } = useLightboxState();
  const slide = getSlideIfPresent(slides, currentIndex);

  const rotate = () => {
    if (isRotateSupported(carousel, slide)) {
      const currentSlide = { ...slide };
      currentSlide.rotate =
        (currentSlide.rotate ?? 0) + 90 * (reverse ? -1 : 1);

      const newSlides = [...slides] as S[];
      newSlides[currentIndex] = currentSlide as S;
      setSlides(newSlides);
    }
  };

  return (
    <IconButton
      onClick={rotate}
      icon={reverse ? RotateLeft : RotateRight}
      label={reverse ? 'Rotate Left' : 'Rotate Right'}
      disabled={!isRotateSupported(carousel, slide)}
    />
  );
}

function RotatedImageSlide({ slide, offset, rect }: ImageSlideProps) {
  const { rotate } = slide;
  const {
    render,
    carousel: { imageFit, imageProps },
    on: { click: onClick },
    rotate: rotateSettings,
  } = useLightboxProps();
  const { currentIndex } = useLightboxState();
  const { transition } = rotateSettings || {};

  const rectAspectRatio = rect ? rect.width / rect.height : 0;
  const slideAspectRatio =
    slide.width && slide.height ? slide.width / slide.height : 0;

  const scale = (() => {
    if (
      !(
        [90, 270].includes(Math.abs((rotate ?? 0) % 360)) &&
        rectAspectRatio &&
        slideAspectRatio
      )
    ) {
      return 1;
    }
    if (rectAspectRatio > slideAspectRatio) {
      return rectAspectRatio > 1 / slideAspectRatio
        ? 1 / slideAspectRatio
        : rectAspectRatio;
    }
    return rectAspectRatio > 1 / slideAspectRatio
      ? 1 / rectAspectRatio
      : slideAspectRatio;
  })();

  return (
    <ImageSlide
      slide={slide}
      offset={offset}
      rect={rect}
      render={render}
      imageFit={imageFit}
      imageProps={imageProps}
      onClick={
        offset === 0 ? () => onClick?.({ index: currentIndex }) : undefined
      }
      style={{
        transform: `rotate(${rotate ?? 0}deg) scale(${scale})`,
        transition:
          transition !== false
            ? transition || 'transform 0.4s ease-in-out'
            : undefined,
      }}
    />
  );
}

export default function useRotate<S extends Slide>(
  originalSlides: S[],
  originalIndex?: number,
) {
  const [index, setIndex] = React.useState(originalIndex);
  const [slides, setSlides] = React.useState(originalSlides);

  const Rotate = React.useCallback(({ augment }: PluginProps) => {
    augment(
      ({
        toolbar,
        carousel,
        render: { slide: renderSlide, thumbnail, ...restRender },
        on: { view: onView, ...restOn },
        ...rest
      }) => ({
        toolbar: addToolbarButton(
          addToolbarButton(
            toolbar,
            'RotateLeft',
            <RotateButton reverse setSlides={setSlides} />,
          ),
          'RotateRight',
          <RotateButton setSlides={setSlides} />,
        ),
        render: {
          slide: ({ slide, offset, rect, ...restRenderSlide }) =>
            isRotateSupported(carousel, slide) ? (
              <RotatedImageSlide {...{ slide, offset, rect }} />
            ) : (
              renderSlide?.({ slide, offset, rect, ...restRenderSlide })
            ),
          thumbnail: ({ slide, rect, render, imageFit }) =>
            isRotateSupported(carousel, slide) ? (
              <RotatedImageSlide {...{ slide, rect }} />
            ) : (
              thumbnail?.({ slide, rect, render, imageFit })
            ),
          ...restRender,
        },
        on: {
          view: ({ index: currentIndex }) => {
            setIndex(currentIndex);
            onView?.({ index: currentIndex });
          },
          ...restOn,
        },
        carousel,
        ...rest,
      }),
    );
  }, []);

  return { slides, index, setIndex, Rotate };
}
