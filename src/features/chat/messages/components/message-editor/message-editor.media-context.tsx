'use client';

import { FileWithUrl, useSelectFiles } from '@/hooks/use-select-files';
import { PropsWithChildren, createContext, useContext } from 'react';

import { DropzoneRootProps } from 'react-dropzone';

interface MessageEditorMediaContextProps {
  files: FileWithUrl[];
  getInputProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  open: () => void;
  removeFile: (file: FileWithUrl) => void;
  handlePasteFile: (
    e: React.ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  reset: () => void;
}

export const MessageEditorMediaContext =
  createContext<MessageEditorMediaContextProps>(
    {} as MessageEditorMediaContextProps,
  );

export const MessageEditorMediaProvider = ({ children }: PropsWithChildren) => {
  const {
    files,
    getInputProps,
    getRootProps,
    open,
    removeFile,
    handlePasteFile,
    reset,
  } = useSelectFiles();
  return (
    <MessageEditorMediaContext.Provider
      value={{
        files,
        getInputProps,
        getRootProps,
        open,
        removeFile,
        handlePasteFile,
        reset,
      }}
    >
      {children}
    </MessageEditorMediaContext.Provider>
  );
};

export const useMessageEditorMedia = () => {
  const context = useContext(MessageEditorMediaContext);
  if (!context) {
    throw new Error(
      'useMessageEditorMedia must be used within MessageEditorMediaProvider',
    );
  }
  return context;
};
