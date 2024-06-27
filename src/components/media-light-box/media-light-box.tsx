import { useReactNativePostMessage } from '@/hooks/use-react-native-post-message';
import { useAppStore } from '@/stores/app.store';
import { cn } from '@/utils/cn';
import downloadFile from '@/utils/download-file';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  MinusIcon,
  PlayIcon,
  PlusIcon,
  RotateCcwIcon,
  RotateCwIcon,
  XIcon,
} from 'lucide-react';
import Image from 'next/image';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Range } from 'react-range';
import {
  TransformComponent,
  TransformWrapper,
  useControls,
  useTransformEffect,
} from 'react-zoom-pan-pinch';
import { Button } from '../actions';
import { Spinner } from '../feedback';
import VideoPlayer from '../video/video-player';
import { useMediaLightBoxStore } from '@/stores/media-light-box.store';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '../data-display/carousel';
import { Drawer, DrawerClose, DrawerContent, DrawerOverlay } from '../data-display/drawer';

export interface Media {
  url: string;
  file?: File;
  type: string;
  name?: string;
}

interface MediaLightBoxProps {
  files: Media[];
  index?: number;
  close?: () => void;
}


const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const STEP_ZOOM = 0.1;

function MediaLightBox(props: MediaLightBoxProps) {
  const { t } = useTranslation('common');
  const imageRef = useRef<HTMLImageElement>(null);
  const { files, index, close } = props;
  const [current, setCurrent] = useState(index || 0);
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const isMobile = useAppStore((state) => state.isMobile);
  const [isVideoFullScreen, setIsVideoFullScreen] = useState(false);
  const { postMessage } = useReactNativePostMessage();
  const [apiCarousel, setApiCarousel] = useState<CarouselApi>()
  const [allowClose, setAllowClose] = useState(true);
  const setIndex = useMediaLightBoxStore((state) => state.setIndex);
  const setFiles = useMediaLightBoxStore((state) => state.setFiles);
  const fetchNextPage = useMediaLightBoxStore((state) => state.fetchNextPage);
  const setFetchNextPage = useMediaLightBoxStore((state) => state.setFetchNextPage);
  
  const onDownload = () => {
    const file = files[current || 0];
    if (!file) return;
    postMessage({
      type: 'Trigger',
      data: {
        event: 'download',
        payload: [
          {
            url: file.url,
            name: file?.name || '',
            type: file.file?.type || '',
          },
        ],
      },
    });
    setDownloading(true);
    downloadFile({
      url: file.url,
      fileName: file?.name || '',
      mimeType: file.file?.type || '',
      successCallback: () => {
        setDownloading(false);
      },
    });
  };
  const onClose = useCallback(() => {
    setIndex();
    setFiles([]);
    setFetchNextPage();
    close && close();
  }, [close]);

  const onPrev = useCallback(() => {
    setCurrent((prev) => (prev == 0 ? prev : prev - 1));
  }, []);
  const onNext = useCallback(() => {
    setCurrent((prev) => (prev == files.length - 1 ? prev : prev + 1));
  }, [files.length]);

  const onRotateLeft = () => {
    if (imageRef.current) {
      if (rotate === 0) {
        setRotate(270);
      } else {
        setRotate((prev) => prev - 90);
      }
    }
  };

  const onRotateRight = () => {
    if (imageRef.current) {
      if (rotate === 270) {
        setRotate(0);
      } else {
        setRotate((prev) => prev + 90);
      }
    }
  };

  const renderMedia = (file: Media, index: number) => {
    switch (file.type) {
      case 'image':
        return <TransformWrapper
          doubleClick={{ disabled: true }}
          smooth={true}
          centerOnInit={true}
          maxScale={MAX_ZOOM}
          minScale={MIN_ZOOM}
          panning={{ 
            disabled: zoom === 1,
            allowLeftClickPan: false,
            allowMiddleClickPan: false,
            allowRightClickPan: false,
          }}
          limitToBounds={true}
        >
          <Controls setZoom={setZoom}/>
          <TransformComponent
            contentClass="!w-full !h-full"
            wrapperClass="!w-full !h-full"
          >
            <Image
              {...index == current && { ref: imageRef }}
              className="h-full w-full object-contain"
              src={file.url}
              alt={file?.file?.name || ''}
              layout="fill"
            />
          </TransformComponent>
        </TransformWrapper>
      case 'video':
        const props = {
          file: {
            url: file.url,
            type: 'video',
            name: file.file?.name || '',
          },
          onFullScreenChange: (value: boolean) => {
            if (value != isVideoFullScreen) setIsVideoFullScreen(value);
          },
          className: 'w-full h-full bg-transparent',
          isFullScreenVideo: isVideoFullScreen,
        };
        if (isVideoFullScreen && index == current) {
          return createPortal(<VideoPlayer {...props} />, document.body);
        }
        return <VideoPlayer {...props} />;
      default:
        return (
          <div className="flex h-full w-full items-center justify-center">
            <p
              className="text-center text-white"
              dangerouslySetInnerHTML={{
                __html: t('MESSAGE.ERROR.NOT_SUPPORT_PREVIEW'),
              }}
            ></p>
          </div>
        );
    }
  };

  // On Zoom image
  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.style.transform = `scale(${zoom}) rotate(${rotate}deg)`;
    }
  }, [zoom, rotate]);

  // Add keydown event (left and right) to change image
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === 'Escape' && !isVideoFullScreen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [current, isVideoFullScreen, onClose, onNext, onPrev]);

  // On Slide change
  useEffect(() => {
    let timer : NodeJS.Timeout;
    const handleSelect = (data: any) => {
      setCurrent(data.selectedScrollSnap());
    }
    const handleScroll = (data: any) => {
      setAllowClose(false);
      if(timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setAllowClose(true);
      }, 100);
    }
    apiCarousel?.on("select", handleSelect);
    apiCarousel?.on("scroll", handleScroll);

    return () => {
      if (apiCarousel) {
        apiCarousel.off("select", handleSelect)
        apiCarousel.off("scroll", handleScroll)
      }
      if(timer) clearTimeout(timer);
    }
  }, [apiCarousel]);


  useEffect(() => {
    setIsVideoFullScreen(false);
    const currentSlide = apiCarousel?.selectedScrollSnap();
    if(currentSlide != current && typeof current == 'number') {
      apiCarousel?.scrollTo(current);
    }
  }, [current]);

  useEffect(() => {
    if (current === files.length - 1 && fetchNextPage) {
      fetchNextPage();
    }
    if (imageRef.current) {
      setZoom(1);
      setRotate(0);
      imageRef.current.style.transform = '';
    }
  }, [current, fetchNextPage, files.length]);

  useEffect(() => {
    if (index == undefined) {
      setCurrent(0);
      setDownloading(false);
      setZoom(1);
      setRotate(0);
    }
  }, [index]);

  if (files.length === 0 || index == undefined) return null;

  // on component unmount reset all state

  return <Drawer 
          open={typeof index == 'number'} 
          onClose={onClose}
          shouldScaleBackground={true}
          dismissible={isMobile ? allowClose : false}
        >
      <DrawerContent className='w-full h-full border-none'>
        <div className="flex h-full w-full flex-col overflow-hidden bg-black/90 p-3 -mt-6">
          <div className="z-20 ml-auto flex w-fit gap-2 rounded-xl bg-black/40 p-2">
            <Button.Icon
              variant={'default'}
              color={'default'}
              size={'xs'}
              shape={'default'}
              onClick={onDownload}
              disabled={downloading}
            >
              {downloading ? <Spinner /> : <DownloadIcon />}
            </Button.Icon>
            <Button.Icon
              variant={'default'}
              color={'default'}
              size={'xs'}
              shape={'default'}
              onClick={onClose}
            >
              <XIcon />
            </Button.Icon>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <div className="no-scrollbar h-full w-full">
              <Carousel
                opts={{
                  align: "center",
                  loop: false,
                  startIndex: index,
                  axis: 'x',
                }}
                setApi={setApiCarousel}
                className='h-full [&>div]:h-full'
              >
                <CarouselContent className='h-full'>
                  {
                    files.map((file, index) => {
                      return (
                        <CarouselItem key={index} className='h-full'>
                          {renderMedia(file, index)}
                        </CarouselItem>
                      )
                    })
                  }
                </CarouselContent>
              </Carousel>
            </div>
          </div>
          <div className="relative h-24 ">
            <div className='flex gap-2 py-2 items-center justify-center w-fit mx-auto'>
              <Button.Icon
                variant={'default'}
                color={'default'}
                size={'xs'}
                shape={'default'}
                className={cn({'!opacity-0': (current == 0 || files.length == 1)})}
                onClick={onPrev}
                disabled={current == 0 || files.length == 1}
              >
                <ChevronLeft />
              </Button.Icon>
          
              <ThumbnailList
                files={files}
                current={current}
                setCurrent={setCurrent}
              />

              <Button.Icon
                variant={'default'}
                color={'default'}
                size={'xs'}
                shape={'default'}
                className={cn({'!opacity-0': (current == files.length - 1 || files.length == 1)})}
                onClick={onNext}
                disabled={current == files.length - 1 || files.length == 1}
              >
                <ChevronRight />
              </Button.Icon>
            </div>

            {/* Controls */}
            {files[current].type === 'image' && (
              <div className="absolute bottom-0 right-0 z-20 ml-auto hidden w-fit items-center gap-2 rounded-xl bg-black/40 p-2 md:flex">
                {/* Button Zoom  */}
                <Button.Icon
                  variant={'default'}
                  color={'default'}
                  size={'xs'}
                  shape={'default'}
                  onClick={() => {
                    if (zoom > MIN_ZOOM) setZoom((prev) => prev - STEP_ZOOM);
                  }}
                >
                  <MinusIcon />
                </Button.Icon>
                {/* Range */}
                <div className="mx-1">
                  <Range
                    step={STEP_ZOOM}
                    min={MIN_ZOOM}
                    max={MAX_ZOOM}
                    values={[zoom]}
                    onChange={(values) => {
                      setZoom(values[0]);
                    }}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        className={cn(
                          'relative h-1 w-[72px] rounded bg-neutral-500',
                        )}
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        className="h-4 w-4 rounded-full bg-white"
                        key="1"
                      ></div>
                    )}
                  />
                </div>
                <Button.Icon
                  variant={'default'}
                  color={'default'}
                  size={'xs'}
                  shape={'default'}
                  onClick={() => {
                    if (zoom < MAX_ZOOM) setZoom((prev) => prev + STEP_ZOOM);
                  }}
                >
                  <PlusIcon />
                </Button.Icon>
                {/* Rotate */}
                <Button.Icon
                  variant={'default'}
                  color={'default'}
                  size={'xs'}
                  shape={'default'}
                  onClick={onRotateLeft}
                >
                  <RotateCcwIcon />
                </Button.Icon>
                <Button.Icon
                  variant={'default'}
                  color={'default'}
                  size={'xs'}
                  shape={'default'}
                  onClick={onRotateRight}
                  className="rotate-45"
                >
                  <RotateCwIcon />
                </Button.Icon>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
}

interface ThumbnailListProps {
  files: Media[];
  current: number;
  setCurrent: (index: number) => void;
}
const ThumbnailList = memo(
  ({ files, current, setCurrent }: ThumbnailListProps) => {
    const renderThumbMedia = (file: Media) => {
      switch (file.type) {
        case 'image':
          return (
            <Image
              className="h-full w-full object-cover"
              src={file.url}
              alt={file?.file?.name || ''}
              width={80}
              height={80}
            />
          );
        case 'video':
          return (
            <div className="relative h-full w-full">
              <video src={file.url} className="h-full w-full object-cover" />
              <Button.Icon
                size={'ss'}
                variant={'default'}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-50"
                color={'default'}
              >
                <PlayIcon />
              </Button.Icon>
            </div>
          );
        default:
          return null;
      }
    };
    const isMobile = useAppStore((state) => state.isMobile);

    const mediaList = useMemo(() => {
      const TOTAL_ITEM = isMobile ? 3 : 5;
      let start = current - Math.floor(TOTAL_ITEM / 2);
      let end = current + Math.floor(TOTAL_ITEM / 2);
      if (files.length <= TOTAL_ITEM) {
        return files.map((file, i) => {
          return {
            ...file,
            index: i,
          };
        });
      }

      if (start < 0) {
        end += Math.abs(start);
        start = 0;
      } else if (end > files.length - 1) {
        start -= end - (files.length - 1);
        end = files.length - 1;
      }
      return files
        .map((file, i) => {
          return {
            ...file,
            index: i,
          };
        })
        .filter((file) => {
          return file.index >= start && file.index <= end;
        });
    }, [current, files, isMobile]);

    if (files.length === 1) return null;

    return (
      <div className="mx-auto flex w-fit flex-1 items-center justify-center gap-2">
        {mediaList.map((file, i) => {
          return (
            <motion.div
              key={file.url}
              className="relative h-20 w-20 cursor-pointer overflow-hidden rounded-xl border border-neutral-50 md:hover:opacity-80"
              onClick={() => setCurrent(file.index)}
              initial={{ opacity: 0, x: i == 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: current > i ? -50 : 50 }}
            >
              {renderThumbMedia(file)}
              {file.index == current && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90">
                  <EyeIcon size={20} color="white" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  },
);
ThumbnailList.displayName = 'ThumbnailList';

interface ControlsProps {
  setZoom: (val: number) => void;
}
const Controls = ({setZoom}: ControlsProps) => {
  useTransformEffect(({ state, instance }) => {
    setZoom(state.scale);
    return () => {
    };
  });
  return <></>;
};

export default memo(MediaLightBox);
