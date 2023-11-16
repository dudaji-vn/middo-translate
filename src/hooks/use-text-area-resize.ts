import React from 'react';
export const useTextAreaResize = (
  text: string,
  defaultHeight?: number,
  refresh?: any,
) => {
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const resizeTextArea = () => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = defaultHeight
      ? `${defaultHeight}px`
      : 'auto';
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  };
  React.useEffect(resizeTextArea, [defaultHeight, text, refresh]);

  return {
    textAreaRef,
    resizeTextArea,
  };
};
