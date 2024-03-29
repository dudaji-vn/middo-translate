import { AnimatePresence, motion } from 'framer-motion';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { PlayCircleIcon, PlusCircleIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/actions';
import Image from 'next/image';
import { SelectedFile, useMediaUpload } from '@/components/media-upload';
import { useEffect, useMemo } from 'react';
import { useMessageEditor } from '.';

export const MediaSlot = () => {
  const { files, removeFile, open } = useMediaUpload();
  const { richText } = useMessageEditor();

  useEffect(() => {
    richText?.commands.focus();
  }, [files, richText?.commands]);

  return (
    <AnimatePresence>
      {files.length > 0 && (
        <div className="flex w-full flex-1 gap-2 overflow-scroll pt-4">
          <Button.Icon
            onClick={open}
            type="button"
            color="secondary"
            size="lg"
            className="rounded-2xl"
          >
            <PlusCircleIcon />
          </Button.Icon>
          <div className="flex w-[10px] flex-1 flex-row-reverse  justify-end gap-2">
            <AnimatePresence>
              {files.map((file) => {
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    key={file.url}
                    className="relative aspect-square h-[60px] w-[60px] shrink-0 overflow-hidden rounded-xl shadow"
                  >
                    <MediaItem file={file} />
                    <button
                      tabIndex={-1}
                      type="button"
                      onClick={() => removeFile(file)}
                    >
                      <div className="absolute right-0 top-0 rounded-full bg-background shadow-1">
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
};

const MediaItem = ({ file }: { file: SelectedFile }) => {
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

            <div className="absolute bottom-0 left-0  w-full rounded-b-md bg-black/50 p-1">
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
