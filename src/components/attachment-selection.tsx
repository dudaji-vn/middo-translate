import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { SelectedFile, useMediaUpload } from './media-upload';
import { Button } from './actions';
import { PlayCircleIcon, PlusCircleIcon, XIcon } from 'lucide-react';
import { FileIcon, defaultStyles } from 'react-file-icon';
import Image from 'next/image';
import { Editor } from '@tiptap/react';
import { MediaPreview } from './media-preview';
import MediaLightBox from './media-light-box';
import { cn } from '@/utils/cn';

export interface AttachmentSelectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  editor?: Editor | null;
  readonly?: boolean;
}

export const AttachmentSelection = forwardRef<
  HTMLDivElement,
  AttachmentSelectionProps
>(({ editor, readonly }, ref) => {
  const { files, removeFile, open } = useMediaUpload();
  const [index, setIndex] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (files.length > 0) editor?.commands.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length]);

  const sliders = useMemo(() => {
    return files
      .filter((file) => {
        const type = file.file.type.split('/')[0];
        return type === 'image' || type === 'video';
      })
      .map((file) => {
        const type = file.file.type.split('/')[0];
        return {
          url: file.url,
          type: type,
          name: file.file.name || '',
        };
      });
  }, [files]);

  return (
    <AnimatePresence>
      {files.length > 0 && (
        <div className="flex w-full flex-1 gap-2 overflow-auto overflow-y-hidden pt-2">
          <Button.Icon
            onClick={open}
            type="button"
            color="secondary"
            size="lg"
            disabled={readonly}
            className={cn('rounded-2xl', {
              hidden: readonly,
            })}
          >
            <PlusCircleIcon />
          </Button.Icon>
          <div className="flex w-[10px] flex-1 flex-row-reverse justify-end gap-2">
            <MediaLightBox
              files={sliders}
              index={index}
              close={() => setIndex(undefined)}
              key={index}
            />
            <AnimatePresence>
              {files.map((file, i) => {
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    key={file.url}
                    className="group relative aspect-square h-[60px] w-[60px]"
                  >
                    <div
                      className="aspect-square h-[60px] w-[60px] shrink-0 cursor-pointer overflow-hidden rounded-xl shadow"
                      onClick={() => setIndex(i)}
                    >
                      <MediaItem file={file} />
                    </div>
                    <button
                      tabIndex={-1}
                      type="button"
                      onClick={() => removeFile(file)}
                      disabled={readonly}
                    >
                      <div className="absolute -right-1 -top-1 rounded-full border bg-background opacity-0 shadow-1 transition-all group-hover:opacity-100">
                        <XIcon width={16} height={16} />
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
});
AttachmentSelection.displayName = 'AttachmentSelection';

export const MediaItem = ({ file }: { file: SelectedFile }) => {
  const ItemComp = useMemo(() => {
    const extension = file.file.name?.split('.').pop();
    switch (file.file.type.split('/')[0]) {
      case 'image':
        return (
          <Image
            fill
            src={file.url}
            alt="img"
            key={file.url}
            className="rounded-lg object-cover"
          />
        );
      case 'video':
        return (
          <div className="relative h-full">
            <video src={file.url} className="h-full w-full" />
            <PlayCircleIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
          </div>
        );
      default:
        return (
          <div className="flex h-full w-full items-center justify-center rounded-xl border">
            <div className="flex p-2">
              <FileIcon
                extension={extension}
                {...file}
                {...defaultStyles[extension as keyof typeof defaultStyles]}
                radius={8}
              />
            </div>

            <div className="absolute bottom-0 left-0  w-full rounded-b-xl bg-black/50 p-1">
              <span
                title={file.file.name}
                className="line-clamp-1 text-xs text-white"
              >
                {file.file.name}
              </span>
            </div>
          </div>
        );
    }
  }, [file]);
  return ItemComp;
};
