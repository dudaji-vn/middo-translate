import { Media } from "@/types";
import { cn } from "@/utils/cn";
import download from "downloadjs";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../actions";
import { DownloadIcon, Maximize2Icon, Pause, PlayIcon, Volume1Icon, Volume2, Volume2Icon, VolumeX, VolumeXIcon, X } from "lucide-react";
import { Direction, Range } from "react-range";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../data-display";

interface VideoProps {
    file: Media;
    className?: string;
}

function VideoPlayer({ file, className }: VideoProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoThumbnailRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const durationBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHoverDurationBar, setIsHoverDurationBar] = useState(false);
  const [thumbnailLeft, setThumbnailLeft] = useState<number>(0);
  const [isOpenVolume, setIsOpenVolume] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isShowActionBar, setIsShowActionBar] = useState(false);


  const toggleVideoPlay = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  }

  const downloadFile = () => {
    var x=new XMLHttpRequest();
    x.open( "GET", file.url , true);
    x.responseType="blob";
    x.onload= function(e: any){
      if(e?.target?.response) download(e?.target?.response, file.name, file.type);
    };
    x.send();
  }
  
  // Add on end video event
  useEffect(() => {
    const handleEnd = () => {
      setIsPlaying(false);
      videoRef.current!.currentTime = 0;
    }
    videoRef.current?.addEventListener('ended', handleEnd);
    // Add duration video
    videoRef.current?.addEventListener('loadedmetadata', () => {
      setVideoDuration(videoRef.current?.duration || 0);
    });
    return () => {
      videoRef.current?.removeEventListener('ended', handleEnd);
    }
  }, [])

  // Add on time update event
  useEffect(() => {
    const handleTimeUpdate = () => {
      setCurrentTime(videoRef.current!.currentTime);
    }
    videoRef.current?.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      videoRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullScreen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [])

  // Add event listener for duration bar to get time and get thumbnail
  useEffect(() => {
    const onMove = async (e: MouseEvent) => {
      setIsHoverDurationBar(true);
      // Get x position of mouse in duration bar => percent = x / width
      const rect = durationBarRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const percent = Math.round((x / rect.width) * 100);
      let duration = Math.round((percent / 100) * videoDuration);
      videoThumbnailRef.current!.currentTime = duration;
      setThumbnailLeft(percent);
    }

    const onLeave = () => {
      setIsHoverDurationBar(false);
    }

    durationBarRef.current?.addEventListener('mousemove', onMove);
    durationBarRef.current?.addEventListener('mouseleave', onLeave);

    return () => {
      durationBarRef.current?.removeEventListener('mousemove', onMove);
      durationBarRef.current?.removeEventListener('mouseleave', onLeave);
    }

  }, [file.url, thumbnailLeft, videoDuration])

  // On Video Volume Change
  useEffect(() => {
    videoRef.current!.volume = volume;
  }, [volume])

  // isShowActionBar when hover to videoRef, and hide after 3s if not hover or not mouse move
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    const handleMouseMove = () => {
      if(timeout) clearTimeout(timeout);
      setIsShowActionBar(true);
      timeout = setTimeout(() => {
        if(!isOpenVolume) {
          console.log('hide');
          setIsShowActionBar(false);
        }
      }, 2000);
    }
    const handleMouseEnter = () => {
      if(timeout) clearTimeout(timeout);
      setIsShowActionBar(true); 
    }
    const handleMouseLeave = () => {
      if(timeout) clearTimeout(timeout);
      if(!isOpenVolume) {
        setIsShowActionBar(false);
      }
    }
    wrapperRef.current?.addEventListener('mouseenter', handleMouseEnter);
    wrapperRef.current?.addEventListener('mouseleave', handleMouseLeave);
    // Move stop mouse inside video
    wrapperRef.current?.addEventListener('mousemove', handleMouseMove);

    return () => {
      wrapperRef.current?.removeEventListener('mouseenter', handleMouseEnter);
      wrapperRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      wrapperRef.current?.removeEventListener('mousemove', handleMouseMove);

      if(timeout) clearTimeout(timeout);
    }
  }, [isOpenVolume])

  const formatVideoTimer = useMemo(() => {
    return new Date(currentTime * 1000).toISOString().substr(14, 5);
  }, [currentTime]);

  return (
    <div
      className={cn(
        "group relative bg-neutral-50", 
        className,
        isFullScreen ? 'fixed inset-0 bg-black/90 z-[51] w-full max-w-full h-full rounded-none' : '', )}
      ref={wrapperRef}
    >
      <video
        ref={videoRef}
        src={file.url}
        controls={false}
        disablePictureInPicture
        className={cn("h-full w-full")}
      />
      {/* Button play */}
      <div className='absolute group inset-3 flex items-center justify-center z-10' onClick={toggleVideoPlay} onDoubleClick={()=>setIsFullScreen(prev=>!prev)}>
        <Button.Icon
          variant={'default'}
          color={'default'}
          shape={'default'}
          className={cn('shadow-2', isPlaying ? 'opacity-0' : '', isPlaying && isFullScreen && '!opacity-0')}
        >
          {
            isPlaying ? <Pause /> : <PlayIcon />
          }
        </Button.Icon>
      </div>

      <div className={cn('absolute inset-0 bg-black/20 pointer-events-none duration-500', (isPlaying || isFullScreen) ? 'opacity-0' : '')}></div>

      {/* Actions */}
      <div className={cn('z-10 absolute bottom-1 left-1 right-1 flex items-center justify-between p-1 bg-black/40 duration-500 gap-2 md:rounded-xl rounded-2xl', isFullScreen ? 'p-2' : '', isShowActionBar ? 'translate-y-0' : 'translate-y-[calc(100%+20px)]')}
      onClick={(e)=>{e.stopPropagation()}}>
        <span className="text-sm text-white">{formatVideoTimer}</span>
        <div className='flex-1 mx-2 py-2 relative' ref={durationBarRef}>
          <Range
            step={0.01}
            min={0}
            max={1}
            values={[currentTime / videoDuration]}
            onChange={(values) => {
              videoRef.current!.currentTime = values[0] * videoDuration;
              setCurrentTime(videoRef.current!.currentTime);
            }}
            renderTrack={({ props, children }) => (
              <div {...props} className={cn("h-1 w-full rounded bg-neutral-500 relative")}>
                <div className="left-0 top-0 bottom-0 bg-primary absolute rounded" style={{width: `${(currentTime/videoDuration) * 100}%`}}/>
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

          {/* Thumbnail Video */}
          <div 
            className={cn("absolute bottom-[calc(100%+16px)] bg-transparent w-[100px] aspect-video rounded-sm overflow-hidden -translate-x-1/2 transition-all pointer-events-none", isHoverDurationBar ? 'visible' : 'hidden')}
            style={{
              left: `${thumbnailLeft}%`,
            }}>
            <video
              ref={videoThumbnailRef}
              src={file.url}
              muted
              controls={false}
              disablePictureInPicture
              className={cn("h-full w-full")}
            />
          </div>
        </div>
        <DropdownMenu open={isOpenVolume} onOpenChange={setIsOpenVolume}>
          <DropdownMenuTrigger>
            <Button.Icon
              variant={'default'}
              color={'default'}
              size={isFullScreen ? 'sm' : 'ss'}
              shape={'default'}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {volume == 0 && <VolumeXIcon />}
              {(volume > 0 && volume < 0.5 && <Volume1Icon />)}
              {(volume >= 0.5 && <Volume2Icon />)}
            </Button.Icon>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            side="top"
            className="bg-black/20 !min-w-1 px-[10px] py-4 max-w-6 border-none flex item-center justify-center z-[52]"
            onClick={() => setIsOpenVolume(false)}
          >
            {/* Range Volume */}
              <Range
                direction={Direction.Up}
                step={0.01}
                min={0}
                max={1}
                values={[volume]}
                onChange={(values) => {
                  setVolume(values[0]);
                }}
                renderTrack={({ props, children }) => (
                  <div {...props} className={cn("h-[80px] w-1 rounded bg-neutral-500 relative")}>
                    <div className="left-0 right-0 bottom-0 bg-primary absolute rounded" style={{height: `${volume * 100}%`}}/>
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
          </DropdownMenuContent>
        </DropdownMenu>
        <Button.Icon
          variant={'default'}
          color={'default'}
          size={isFullScreen ? 'sm' : 'ss'}
          shape={'default'}
          className={cn(isFullScreen ? '' : 'hidden')}
          onClick={downloadFile}
        >
          <DownloadIcon />
        </Button.Icon>
        <Button.Icon
          variant={'default'}
          color={'default'}
          size={isFullScreen ? 'sm' : 'ss'}
          shape={'default'}
          onClick={() => setIsFullScreen(!isFullScreen)}
        >
          {isFullScreen ? <X /> : <Maximize2Icon />}
        </Button.Icon>
      </div>
      {/* Button expand */}

    </div>
  );
};





export default memo(VideoPlayer);