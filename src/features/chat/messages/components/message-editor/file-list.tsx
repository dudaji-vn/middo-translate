import { AnimatePresence, motion } from 'framer-motion';
import { FileIcon, defaultStyles } from 'react-file-icon';
import { PlusCircleIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/actions';
import { FileWithUrl } from '@/hooks/use-select-files';
import Image from 'next/image';

export const FileList = ({
  files,
  onRemoveFile,
  onAddMoreFiles,
}: {
  files: FileWithUrl[];
  onRemoveFile?: (file: FileWithUrl) => void;
  onAddMoreFiles?: () => void;
}) => {
  return (
    <AnimatePresence>
      {files.length > 0 && (
        <div className="flex flex-row-reverse justify-end gap-2 px-2 pb-1 pt-4">
          <AnimatePresence>
            {files.map((file) => {
              const isImage = file.file.type.startsWith('image');
              const extension = file.file.name?.split('.').pop();
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  key={file.url}
                  className="relative aspect-square h-[60px] overflow-hidden rounded-lg shadow"
                >
                  {isImage ? (
                    <Image
                      layout="fill"
                      src={file.url}
                      alt="img"
                      key={file.url}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-xl border">
                      <div className="flex p-2">
                        <FileIcon
                          extension={extension}
                          {...file}
                          {...defaultStyles[
                            extension as keyof typeof defaultStyles
                          ]}
                          radius={8}
                        />
                      </div>

                      <div className="absolute bottom-0 left-0  w-full rounded-b-md bg-black/50 p-1">
                        <span
                          title={file.file.name}
                          className="line-clamp-1 text-xs text-primary-foreground"
                        >
                          {file.file.name}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    tabIndex={-1}
                    type="button"
                    onClick={() => onRemoveFile?.(file)}
                  >
                    <div className="absolute right-0 top-0 rounded-full bg-background shadow-1">
                      <XIcon width={20} height={20} />
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <Button.Icon
            onClick={onAddMoreFiles}
            type="button"
            color="secondary"
            size="lg"
            className="rounded-2xl"
          >
            <PlusCircleIcon />
          </Button.Icon>
        </div>
      )}
    </AnimatePresence>
  );
};
