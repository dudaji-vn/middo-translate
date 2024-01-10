import {
  CloudinaryUploadResponse,
  deleteByPublicId,
  uploadMultiMedia,
} from '@/utils/upload-media';

import { useDropzone } from 'react-dropzone';
import { useModalStore } from '@/stores/modal.store';
import { useState } from 'react';

const MAX_FILE_SIZE = 25;
export type FileWithUrl = {
  id: string;
  url: string;
  file: File;
  uploaded?: boolean;
  upLoadedResponse?: CloudinaryUploadResponse;
};
export const useSelectFiles = () => {
  const [files, setFiles] = useState<FileWithUrl[]>([]);
  const show = useModalStore((state) => state.show);

  const [uploadedFiles, setUploadedFiles] = useState<FileWithUrl[]>([]);

  const handleAccept = async (files: File[]) => {
    const newFiles = files.map((file) => crateFile(file));
    setFiles((old) => [...old, ...newFiles]);
    const multipleRes = await uploadMultiMedia(files);
    const uploadedFiles = newFiles.map((file, index) => {
      return {
        ...file,
        uploaded: true,
        upLoadedResponse: multipleRes[index],
      };
    });
    setUploadedFiles((old) => [...old, ...uploadedFiles]);
  };
  const handleReject = (files: File[]) => {
    show({
      title: 'Failed to upload file',
      description: `The file that you have selected is too large. The maximum size is 25 MB.`,
      type: 'error',
    });
  };
  const { getInputProps, getRootProps, open } = useDropzone({
    onDropAccepted: handleAccept,
    noClick: true,
    noKeyboard: true,
    maxSize: MAX_FILE_SIZE * 1024 * 1024, // 25MB
    onDropRejected: (files) => {
      handleReject(files.map((fileRejection) => fileRejection.file));
    },
  });
  const removeFile = (file: FileWithUrl) => {
    setFiles((old) => old.filter((f) => f.id !== file.id));
    setUploadedFiles((old) =>
      old.filter((f) => {
        if (f.id === file.id) {
          URL.revokeObjectURL(f.url);
          deleteByPublicId(f.upLoadedResponse!.public_id);
          return false;
        }
        return true;
      }),
    );
  };
  const handlePasteFile = (
    e: React.ClipboardEvent<HTMLDivElement | HTMLTextAreaElement>,
  ) => {
    const items = e.clipboardData.items;
    const files: File[] = [];
    const rejectedFiles: File[] = [];
    Array.from(items).forEach((item) => {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          if (file.size > MAX_FILE_SIZE * 1024 * 1024) {
            rejectedFiles.push(file);
          } else files.push(file);
        }
      }
    });
    if (files.length > 0) {
      handleAccept(files);
    }

    if (rejectedFiles.length > 0) {
      handleReject(rejectedFiles);
    }
  };

  const reset = () => {
    setFiles([]);
  };
  return {
    files,
    getInputProps,
    getRootProps,
    open,
    removeFile,
    handlePasteFile,
    reset,
    uploadedFiles,
  };
};

const covertBytesToMB = (bytes: number, isDecimal = true) => {
  const mb = bytes / (1024 * 1024);
  return isDecimal ? mb.toFixed(2) : Math.floor(mb);
};

const crateFile = (file: File): FileWithUrl => {
  const id = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
  return {
    id,
    url: URL.createObjectURL(file),
    file,
  };
};
