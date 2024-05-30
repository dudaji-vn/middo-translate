import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../actions";
import { ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, MinusIcon, PlayIcon, PlusIcon, RotateCcwIcon, RotateCwIcon, XIcon } from "lucide-react";
import { createPortal } from "react-dom";
import downloadFile from "@/utils/download-file";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import VideoPlayer from "../video/video-player";
import { motion, AnimatePresence } from "framer-motion";
import { Range } from "react-range";
import { cn } from "@/utils/cn";
import { useAppStore } from "@/stores/app.store";
import { Spinner } from "../feedback";
import { TransformWrapper, TransformComponent,useControls  } from "react-zoom-pan-pinch";

interface Media {
  url: string;
  file?: File;
  type: string;
  name?: string;
}

interface MediaLightBoxProps {
  files: Media[];
  index?: number;
  close?: () => void;
  fetchNextPage?: () => void;
}

function MediaLightBox(props: MediaLightBoxProps) {
  const { t } = useTranslation('common');
  const imageRef = useRef<HTMLImageElement>(null);
  const { files, index, fetchNextPage, close } = props;
  const [current, setCurrent] = useState(index || 0);
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [paintingStart, setPaintingStart] = useState<number>(0);
  const [isVideoFullScreen, setIsVideoFullScreen] = useState(false);

  const onDownload = () => {
    const file = files[current || 0];
    if(!file) return;
    setDownloading(true);
    downloadFile({
      url: file.url,
      fileName: file?.name || '',
      mimeType: file.file?.type || '',
      successCallback: () => {
        setDownloading(false);
      }
    })
    
  }
  const onClose = useCallback(() => {
    close && close();
  }, [close]);

  const onPrev = useCallback(() => {
    setCurrent((prev) => prev == 0 ? prev :prev - 1);
  }, []);
  const onNext = useCallback(() => {
    setCurrent((prev) => (prev == files.length - 1) ? prev : prev + 1);
  }, [files.length]);
  
  const onRotateLeft = () => {
    if(imageRef.current) {
      if(rotate === 0) {
        setRotate(270);
      }else {
        setRotate((prev) => prev - 90);
      }
    }

  }

  const onRotateRight = () => {
    if(imageRef.current) {
      if(rotate === 270) {
        setRotate(0);
      } else {
        setRotate((prev) => prev + 90);
      }
    }
  }

  const renderMediaMain = () => {
    switch(files[current].type) {
      case "image":
        return <TransformWrapper
        doubleClick={{disabled: true}}
        smooth={true}
        centerOnInit={true}
        panning={{ disabled: zoom === 1 }}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <>
            <Controls zoom={zoom}/>
            <TransformComponent
              contentClass="!w-full !h-full" 
              wrapperClass="!w-full !h-full">
              <Image ref={imageRef} className="w-full h-full object-contain" src={files[current].url} alt={files[current]?.file?.name || ''} width={500} height={500}/>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
      case "video":
        const props = {
          file: {
            url: files[current].url,
            type: 'video',
            name: files[current].file?.name || ''
          },
          onFullScreenChange: (value: boolean) => {
            if(value != isVideoFullScreen) setIsVideoFullScreen(value);
          },
          className: 'w-full h-full bg-transparent',
          isFullScreenVideo: isVideoFullScreen
        }
        if(isVideoFullScreen) {
          return createPortal(<VideoPlayer {...props}/>, document.body)
        }
        return <VideoPlayer {...props}/>
      default:
        return <div className="w-full h-full flex items-center justify-center">
          <p className="text-center text-white" dangerouslySetInnerHTML={{__html: t('MESSAGE.ERROR.NOT_SUPPORT_PREVIEW')}}></p>
        </div>
    }
  }

  // On Zoom image
  useEffect(() => {
    if(imageRef.current) {
      imageRef.current.style.transform = `scale(${zoom}) rotate(${rotate}deg)`;
    }
  }, [zoom, rotate]);

  // Add keydown event (left and right) to change image
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if(e.key === 'ArrowLeft') {
        onPrev();
      }else if(e.key === 'ArrowRight') {
        onNext();
      }else if(e.key === 'Escape' && !isVideoFullScreen) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [current, isVideoFullScreen, onClose, onNext, onPrev]);

  // On Change current image => 
  useEffect(() => {
    setIsVideoFullScreen(false);
  }, [current])

  useEffect(() => {
    if(current === files.length - 1 && fetchNextPage) {
      fetchNextPage();
    }
    if(imageRef.current) {
      setZoom(1);
      setRotate(0);
      imageRef.current.style.transform = '';
    }
  }, [current, fetchNextPage, files.length]);

  useEffect(() => {
    if(index == undefined) {
      setCurrent(0);
      setDownloading(false);
      setZoom(1);
      setRotate(0);
    }
  }, [index]);

  if(files.length === 0 || index == undefined) return null;

  // on component unmount reset all state 
  

  return (
    createPortal(
    <div className="fixed left-0 right-0 bottom-0 top-0 w-full h-full bg-black/90 z-[51] flex flex-col p-3 overflow-hidden">
      <div className="flex gap-2 p-2 rounded-xl bg-black/40 w-fit z-20 ml-auto">
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
      <div className="flex-1 overflow-hidden relative">
        {/* Button Prev */}
        {current > 0 && files?.length > 1 && <Button.Icon
         variant={'default'}
         color={'default'}
         size={'xs'}
         shape={'default'}
         className="absolute top-1/2 left-0 transform -translate-y-1/2 z-50 opacity-40"
         onClick={onPrev}
        >
          <ChevronLeft />
        </Button.Icon>}
        {/* Image main */}
        
        <div className="w-full h-full flex justify-center items-center overflow-auto no-scrollbar focus:scroll-auto select-none">
          {/* <div className="absolute z-[-1] inset-0 flex items-center justify-center">
            <Image src="/loading-middo.gif" width={50} height={50} alt="Loading"/>
          </div> */}
          <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={1}
            smooth={true}
            centerOnInit={true}
            panning={{
              disabled: true,
            }}
            onPanningStart={(_, e: MouseEvent | TouchEvent) => {
              let offsetX = 0;
              if(e instanceof MouseEvent) {
                offsetX = e.offsetX;
              } else {
                offsetX = e.touches[0].clientX;
              }
              setPaintingStart(offsetX || 0)
            }}
            onPanningStop={(ref, e: MouseEvent | TouchEvent) => {
              if(zoom != 1) return;
              const THRESHOLD = 50;
              let offsetX = 0;
              if(e instanceof MouseEvent) {
                offsetX = e.offsetX;
              } else {
                offsetX = e.touches[0].clientX;
              }
              let threshold = paintingStart - offsetX;
              if(threshold > THRESHOLD) {
                onNext();
              } else if(threshold < -THRESHOLD) {
                onPrev();
              }
            }}
          >
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <>
                <TransformComponent 
                  contentClass="!w-full !h-full" 
                  wrapperClass="!w-full !h-full">
                  {renderMediaMain()}
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
          
        </div>
        {/* Button next */}
        {current < files.length - 1 && files?.length > 1 && <Button.Icon
         variant={'default'}
         color={'default'}
         size={'xs'}
         shape={'default'}
         className="absolute top-1/2 right-0 transform -translate-y-1/2 z-50 opacity-40"
         onClick={onNext}
        >
          <ChevronRight />
        </Button.Icon>}
      </div>
      <div className="h-24 py-2 flex relative">
        {/* Thumbnail */}
        <ThumbnailList files={files} current={current} setCurrent={setCurrent}/>

        {/* Controls */}
        {files[current].type === 'image' && <div className="hidden md:flex gap-2 p-2 rounded-xl bg-black/40 w-fit z-20 ml-auto absolute bottom-0 right-0 items-center">
          {/* Button Zoom  */}
          <Button.Icon
            variant={'default'}
            color={'default'}
            size={'xs'}
            shape={'default'}
            onClick={()=>{
              if(zoom > 0.6) setZoom((prev) => prev - 0.1)
            }}
          >
            <MinusIcon />
          </Button.Icon>
          {/* Range */}
          <div className="mx-1">
            <Range
              step={0.1}
              min={0.5}
              max={1.5}
              values={[zoom]}
              onChange={(values) => {
                setZoom(values[0]);
              }}
              renderTrack={({ props, children }) => (
                <div {...props} className={cn("w-[72px] h-1 rounded bg-neutral-500 relative")}>
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
            onClick={()=>{
              if(zoom < 1.5) setZoom((prev) => prev + 0.1)
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
        </div>}
        
      </div>
    </div>,
    document.body
    )
  );
};

interface ThumbnailListProps {
  files: Media[];
  current: number;
  setCurrent: (index: number) => void;
}
const ThumbnailList = memo(({files, current, setCurrent}: ThumbnailListProps) => {

  const renderThumbMedia = (file: Media) => {
    switch(file.type) {
      case "image":
        return <Image className="w-full h-full object-cover" src={file.url} alt={file?.file?.name || ''} width={80} height={80}/>
      case "video":
        return <div className="relative w-full h-full">
          <video src={file.url} className="w-full h-full object-cover"/>
          <Button.Icon 
            size={'ss'}
            variant={'default'}
            className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50'
            color={'default'}
          >
            <PlayIcon />
          </Button.Icon>
        </div>
      default:
        return null;
    }
  }
  const isMobile = useAppStore((state) => state.isMobile);

  const mediaList = useMemo(()=>{
    const TOTAL_ITEM = isMobile ? 3 : 5;
    let start = current - Math.floor(TOTAL_ITEM / 2);
    let end = current + Math.floor(TOTAL_ITEM / 2);
    if(files.length <= TOTAL_ITEM) {
      return files.map((file, i) => {
        return {
          ...file,
          index: i
        }
      })
    }

    if(start < 0) {
      end += Math.abs(start);
      start = 0;
    }else if(end > files.length - 1) {
      start -= end - (files.length - 1);
      end = files.length - 1;
    }
    return files.map((file, i) => {
      return {
        ...file,
        index: i
      }
    }).filter((file) => {
      return file.index >= start && file.index <= end;
    })
  }, [current, files, isMobile])

  if(files.length === 1) return null;

  return <div className="w-fit mx-auto flex-1 flex justify-center items-center gap-2">
    {mediaList.map((file, i) => {
      return <motion.div 
        key={file.url} 
        className="w-20 h-20 rounded-xl overflow-hidden border border-neutral-50 relative cursor-pointer md:hover:opacity-80" 
        onClick={()=>setCurrent(file.index)}
        initial={{ opacity: 0, x: i == 0 ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: current > i ? -50 : 50 }}
        >
        {renderThumbMedia(file)}
        {(file.index == current) && <div className="absolute inset-0 bg-black/90 flex items-center justify-center"><EyeIcon size={20} color="white" /></div>}
    </motion.div>
    })}
</div>
})
ThumbnailList.displayName = 'ThumbnailList';

const Controls = ({zoom}: {zoom: number}) => {
  const { setTransform,  } = useControls();
  // setTransform(0, 0, zoom);
  return <></>
}


export default memo(MediaLightBox);
