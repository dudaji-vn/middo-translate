import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
export type FileWithUrl = {
  url: string;
  file: File;
};
export const useSelectFiles = () => {
  const [files, setFiles] = useState<FileWithUrl[]>([]);
  const { getInputProps, getRootProps, open } = useDropzone({
    onDropAccepted: (files) => {
      const newFiles = files.map((file) => ({
        url: URL.createObjectURL(file),
        file,
      }));
      setFiles((old) => [...old, ...newFiles]);
    },
    noClick: true,
    noKeyboard: true,
    maxSize: 3 * 1024 * 1024, // 5MB
  });
  const removeFile = (file: FileWithUrl) => {
    setFiles((old) => old.filter((f) => f.url !== file.url));
  };
  const handlePasteFile = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    const files = Array.from(items)
      .filter((item) => item.kind === 'file')
      .map((item) => item.getAsFile());
    const newFiles = files.map((file) => ({
      url: URL.createObjectURL(file!),
      file: file!,
    }));
    setFiles((old) => [...old, ...newFiles]);
  };
  return {
    files,
    getInputProps,
    getRootProps,
    open,
    removeFile,
    handlePasteFile,
  };
};
