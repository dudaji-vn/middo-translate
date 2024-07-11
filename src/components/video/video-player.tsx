import { Media } from '@/types';
import { cn } from '@/utils/cn';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../actions';
import {
  DownloadIcon,
  Maximize2Icon,
  Pause,
  PlayIcon,
  Volume1Icon,
  Volume2,
  Volume2Icon,
  VolumeX,
  VolumeXIcon,
  X,
} from 'lucide-react';
import { Direction, Range } from 'react-range';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../data-display';
import { useOnClickOutside } from 'usehooks-ts';
import { useMediaSettingStore } from '@/stores/media-setting.store';
import downloadFile from '@/utils/download-file';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useMediaLightBoxStore } from '@/stores/media-light-box.store';
import { announceToParent } from '@/utils/iframe-util';

interface VideoProps {
  file: {
    url: string;
    name: string;
    type: string;
  };
  className?: string;
  isShowFullScreen?: boolean;
  isShowDownload?: boolean;
  isShowVolume?: boolean;
  isFullScreenVideo?: boolean;
  onDisableLongPress?: (val: boolean) => void;
  onFullScreenChange?: (isFullScreen: boolean) => void;
  poster?: string;
}

function VideoPlayer(props: VideoProps) {
  const {
    file,
    className,
    isShowDownload = true,
    isShowFullScreen = true,
    isShowVolume = true,
    isFullScreenVideo = false,
    onDisableLongPress,
    onFullScreenChange,
    poster,
  } = props;
  // const [isFullScreen, setIsFullScreen] = useState(isFullScreenVideo);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoThumbnailRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const durationBarRef = useRef<HTMLDivElement>(null);
  const rangeVolumeRef = useRef<HTMLDivElement>(null);
  const buttonVolumeRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const setFullScreenStore = useMediaSettingStore((state) => state.setFullScreenStore);
  const isFullScreenStore = useMediaSettingStore((state) => state.isFullScreenStore);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHoverDurationBar, setIsHoverDurationBar] = useState(false);
  const [thumbnailLeft, setThumbnailLeft] = useState<number>(0);
  const [isOpenVolume, setIsOpenVolume] = useState(false);
  const [isShowActionBar, setIsShowActionBar] = useState(false);
  const { volume } = useMediaSettingStore((state) => ({
    volume: state.volume,
    setVolume: state.setVolume,
  }));

  const toggleVideoPlay = useCallback(() => {
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  const download = () => {
    downloadFile({
      url: file.url,
      fileName: file.name,
      mimeType: file.type,
    });
  };

  // Add on end video event
  useEffect(() => {
    const ref = videoRef.current;
    const handleEnd = () => {
      setIsPlaying(false);
      ref!.currentTime = 0;
    };

    const handleLoadedData = () => {
      setVideoDuration(videoRef.current?.duration || 0.1);
    };

    videoRef.current?.addEventListener('ended', handleEnd);
    // Add duration video
    videoRef.current?.addEventListener('loadedmetadata', handleLoadedData);
    if (videoRef?.current?.duration) {
      handleLoadedData();
    }
    return () => {
      videoRef.current?.removeEventListener('ended', handleEnd);
      videoRef.current?.removeEventListener('loadedmetadata', handleLoadedData);
    };
  }, []);

  // Add on time update event
  useEffect(() => {
    const ref = videoRef.current;
    const handleTimeUpdate = () => {
      setCurrentTime(ref?.currentTime || 0);
    };
    ref?.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      ref?.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    if (!isFullScreenStore) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        setFullScreenStore(false)
      }
      if (e.code === 'Space') {
        e.preventDefault();
        toggleVideoPlay();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullScreenStore, toggleVideoPlay, setFullScreenStore]);

  // Add event listener for duration bar to get time and get thumbnail
  useEffect(() => {
    const ref = durationBarRef.current;
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
    };

    const onLeave = () => {
      setIsHoverDurationBar(false);
    };

    ref?.addEventListener('mousemove', onMove);
    ref?.addEventListener('mouseleave', onLeave);

    return () => {
      ref?.removeEventListener('mousemove', onMove);
      ref?.removeEventListener('mouseleave', onLeave);
    };
  }, [file.url, thumbnailLeft, videoDuration]);

  // On Video Volume Change
  useEffect(() => {
    videoRef.current!.volume = volume;
  }, [volume]);

  // isShowActionBar when hover to videoRef, and hide after 3s if not hover or not mouse move
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    const ref = wrapperRef.current;
    const handleMouseMove = () => {
      if (timeout) clearTimeout(timeout);
      setIsShowActionBar(true);
      timeout = setTimeout(() => {
        if (!isOpenVolume) {
          setIsShowActionBar(false);
        }
      }, 2000);
    };
    const handleMouseEnter = () => {
      if (timeout) clearTimeout(timeout);
      setIsShowActionBar(true);
    };
    const handleMouseLeave = () => {
      if (timeout) clearTimeout(timeout);
      if (!isOpenVolume) {
        setIsShowActionBar(false);
      }
    };
    ref?.addEventListener('mouseenter', handleMouseEnter);
    ref?.addEventListener('mouseleave', handleMouseLeave);
    // Move stop mouse inside video
    ref?.addEventListener('mousemove', handleMouseMove);

    return () => {
      ref?.removeEventListener('mouseenter', handleMouseEnter);
      ref?.removeEventListener('mouseleave', handleMouseLeave);
      ref?.removeEventListener('mousemove', handleMouseMove);

      if (timeout) clearTimeout(timeout);
    };
  }, [isOpenVolume]);

  useEffect(() => {
    const ref = actionMenuRef.current;
    const handleMouseEnter = () => {
      onDisableLongPress && onDisableLongPress(true);
    };
    const handleMouseLeave = () => {
      onDisableLongPress && onDisableLongPress(false);
    };
    ref?.addEventListener('mouseenter', handleMouseEnter);
    ref?.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      ref?.removeEventListener('mouseenter', handleMouseEnter);
      ref?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [onDisableLongPress]);

  useEffect(() => {
    onFullScreenChange && onFullScreenChange(isFullScreenStore);
  }, [isFullScreenStore, onFullScreenChange]);

  // Use click out side to close volume
  useOnClickOutside([rangeVolumeRef, buttonVolumeRef], () => {
    if (isOpenVolume) setIsOpenVolume(false);
  });

  const formatVideoTimer = useMemo(() => {
    return new Date(currentTime * 1000).toISOString().substr(14, 5);
  }, [currentTime]);

  return (
    <div
      className={cn(
        'group relative overflow-hidden bg-transparent',
        className,
        isFullScreenStore
          ? 'fixed inset-0 z-[51] h-full w-full max-w-full rounded-none bg-black/90'
          : 'z-[1]',
      )}
      ref={wrapperRef}
    >
      {poster && !isPlaying && (
        <Image
          src={poster}
          alt="Video Intro Thumbnail"
          fill={true}
          objectFit="contain"
        />
      )}
      <video
        ref={videoRef}
        src={file.url}
        controls={false}
        disablePictureInPicture
        className={cn('h-full w-full object-contain opacity-0', {
          'opacity-100': isPlaying || !poster,
        })}
      />
      {/* Button play */}
      <div
        className="group absolute inset-3 z-10 flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          toggleVideoPlay();
        }}
        onDoubleClick={() => setFullScreenStore(!isFullScreenStore)}
      >
        <Button.Icon
          variant={'default'}
          color={'default'}
          shape={'default'}
          size={isFullScreenStore ? 'md' : 'sm'}
          className={cn(
            'shadow-2',
            isPlaying ? 'opacity-0' : '',
            isPlaying && isFullScreenStore && '!opacity-0',
          )}
        >
          {isPlaying ? <Pause /> : <PlayIcon />}
        </Button.Icon>
      </div>

      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-black/20 duration-500',
          isPlaying || isFullScreenStore || poster ? 'opacity-0' : '',
        )}
      ></div>

      {/* Actions */}
      <div
        className={cn(
          'absolute bottom-1 left-1 right-1 z-10 flex items-center justify-end gap-2 rounded-2xl  bg-black/40 p-1 px-2 duration-500 md:rounded-xl',
          isFullScreenStore ? 'p-2' : 'bg-transparent md:bg-black/40',
          isShowActionBar ? 'translate-y-0' : 'translate-y-[calc(100%+20px)]',
        )}
        ref={actionMenuRef}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <span
          className={cn(
            'hidden text-sm text-white md:block',
            isFullScreenStore && 'block',
          )}
        >
          {formatVideoTimer}
        </span>
        <div
          className={cn(
            'relative mx-2 hidden flex-1 py-2 md:block',
            isFullScreenStore && 'block',
          )}
          ref={durationBarRef}
        >
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
              <div {...props} className={cn('relative h-4 w-full rounded')}>
                <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 rounded bg-neutral-500" />
                <div
                  className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded bg-primary "
                  style={{ width: `${(currentTime / videoDuration) * 100}%` }}
                />
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
            className={cn(
              'pointer-events-none absolute bottom-[calc(100%+16px)] aspect-video w-[100px] -translate-x-1/2 overflow-hidden rounded-sm bg-transparent transition-all',
              isHoverDurationBar ? 'visible' : 'hidden',
            )}
            style={{
              left: `${thumbnailLeft}%`,
            }}
          >
            <video
              ref={videoThumbnailRef}
              src={file.url}
              muted
              controls={false}
              disablePictureInPicture
              className={cn('h-full w-full')}
            />
          </div>
        </div>
        {isShowVolume && (
          <DropdownMenu open={isOpenVolume}>
            <DropdownMenuTrigger asChild={true}>
              <div
                ref={buttonVolumeRef}
                className={cn('hidden md:block', isFullScreenStore && 'block')}
              >
                <ButtonVolume
                  isFullScreen={isFullScreenStore}
                  isOpenVolume={isOpenVolume}
                  setIsOpenVolume={setIsOpenVolume}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              side="top"
              className="item-center z-[52] flex !min-w-1 max-w-6 justify-center border-none bg-black/20 px-[10px] py-4"
              onClick={() => setIsOpenVolume(false)}
            >
              <div ref={rangeVolumeRef}>
                <RangeVolume />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {/* Download */}
        {isShowDownload && (
          <Button.Icon
            variant={'default'}
            color={'default'}
            size={isFullScreenStore ? 'xs' : 'ss'}
            shape={'default'}
            className={cn(isFullScreenStore ? '' : 'hidden')}
            onClick={download}
          >
            <DownloadIcon />
          </Button.Icon>
        )}
        {/* Full Screen */}
        {isShowFullScreen && (
          <Button.Icon
            variant={'default'}
            color={'default'}
            size={isFullScreenStore ? 'xs' : 'ss'}
            shape={'default'}
            onClick={() => setFullScreenStore(!isFullScreenStore)}
          >
            {isFullScreenStore ? <X /> : <Maximize2Icon />}
          </Button.Icon>
        )}
      </div>
    </div>
  );
}

interface ButtonVolumeProps {
  isFullScreen: boolean;
  isOpenVolume: boolean;
  setIsOpenVolume: (value: boolean) => void;
}
const ButtonVolume = memo(
  ({ isFullScreen, isOpenVolume, setIsOpenVolume }: ButtonVolumeProps) => {
    const { volume, setVolume } = useMediaSettingStore((state) => ({
      volume: state.volume,
      setVolume: state.setVolume,
    }));

    const onClickVolume = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isOpenVolume) {
        setIsOpenVolume(true);
        return;
      }
      if (isOpenVolume && volume > 0) {
        setVolume(0);
      } else if (isOpenVolume && volume == 0) {
        setVolume(1);
      }
    };
    return (
      <Button.Icon
        variant={'default'}
        color={'default'}
        size={isFullScreen ? 'xs' : 'ss'}
        shape={'default'}
        onClick={onClickVolume}
      >
        {volume == 0 && <VolumeXIcon />}
        {volume > 0 && volume < 0.5 && <Volume1Icon />}
        {volume >= 0.5 && <Volume2Icon />}
      </Button.Icon>
    );
  },
);
ButtonVolume.displayName = 'ButtonVolume';

const RangeVolume = memo(() => {
  const { volume, setVolume } = useMediaSettingStore((state) => ({
    volume: state.volume,
    setVolume: state.setVolume,
  }));
  return (
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
        <div
          {...props}
          className={cn('relative h-[80px] w-1 rounded bg-neutral-500')}
        >
          <div
            className="absolute bottom-0 left-0 right-0 rounded bg-primary"
            style={{ height: `${volume * 100}%` }}
          />
          {children}
        </div>
      )}
      renderThumb={({ props }) => (
        <div {...props} className="h-4 w-4 rounded-full bg-white" key="1"></div>
      )}
    />
  );
});
RangeVolume.displayName = 'RangeVolume';

export default memo(VideoPlayer);
