'use client';

import { useModalStore } from '@/stores/modal.store';
import {
  CloudinaryUploadResponse,
  deleteByPublicId,
  uploadMultiMedia,
} from '@/utils/upload-media';
import { PropsWithChildren, createContext, useContext, useState } from 'react';

import { DropzoneRootProps, useDropzone, DropzoneState } from 'react-dropzone';

interface MediaUploadContextProps extends DropzoneState {
  files: SelectedFile[];
  uploadedFiles: UploadedFile[];
  getInputProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  open: () => void;
  removeFile: (file: SelectedFile) => void;
  handlePasteFile: (
    e: React.ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  reset: () => void;
}

export const MediaUploadContext = createContext<MediaUploadContextProps>(
  {} as MediaUploadContextProps,
);

export type SelectedFile = {
  url: string;
  file: File;
};
export type UploadedFile = {
  localUrl: string;
  url: string;
  file: File;
  metadata: CloudinaryUploadResponse;
};
export interface MediaUploadProps {}
const MAX_FILE_SIZE = 25;

export const MediaUploadProvider = ({ children }: PropsWithChildren) => {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const handleAccept = async (files: File[]) => {
    const newFiles = files.map((file) => crateFile(file));
    setFiles((old) => [...old, ...newFiles]);
    const multipleRes = await uploadMultiMedia(files);
    const newUploadedFiles = multipleRes.map((res, index) => {
      return {
        localUrl: newFiles[index].url,
        url: res.secure_url,
        file: files[index],
        metadata: res,
      };
    });
    setUploadedFiles((old) => [...old, ...newUploadedFiles]);
  };
  const show = useModalStore((state) => state.show);
  const handleReject = (files: File[]) => {
    show({
      title: 'Failed to upload file',
      description: `The file that you have selected is too large. The maximum size is 25 MB.`,
      type: 'error',
    });
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

  const dropzoneState = useDropzone({
    onDropAccepted: handleAccept,
    noClick: true,
    noKeyboard: true,
    maxSize: MAX_FILE_SIZE * 1024 * 1024, // 25MB
    onDropRejected: (files) => {
      handleReject(files.map((fileRejection) => fileRejection.file));
    },
  });
  const removeFile = (file: SelectedFile) => {
    setFiles((old) => old.filter((f) => f.url !== file.url));
    setUploadedFiles((old) =>
      old.filter((f) => {
        if (f.localUrl === file.url) {
          URL.revokeObjectURL(f.url);
          deleteByPublicId(f.metadata.public_id);
          return false;
        }
        return true;
      }),
    );
  };
  const reset = () => {
    setFiles([]);
  };
  return (
    <MediaUploadContext.Provider
      value={{
        files,
        uploadedFiles,
        removeFile,
        handlePasteFile,
        reset,
        ...dropzoneState,
      }}
    >
      {children}
    </MediaUploadContext.Provider>
  );
};

export const useMediaUpload = () => {
  const context = useContext(MediaUploadContext);
  if (!context) {
    throw new Error('useMediaUpload must be used within MediaUploadProvider');
  }
  return context;
};

const crateFile = (file: File): SelectedFile => {
  return {
    url: URL.createObjectURL(file),
    file,
  };
};
