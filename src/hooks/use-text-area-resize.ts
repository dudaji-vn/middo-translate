import React from 'react';
export const useTextAreaResize = (text: string, defaultHeight?: number) => {
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const resizeTextArea = () => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = defaultHeight
      ? `${defaultHeight}px`
      : 'auto';
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  };
  React.useEffect(resizeTextArea, [defaultHeight, text]);

  return {
    textAreaRef,
    resizeTextArea,
  };
};
