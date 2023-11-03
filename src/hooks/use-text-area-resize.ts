import React from 'react';
export const useTextAreaResize = (text: string) => {
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const resizeTextArea = () => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  };
  React.useEffect(resizeTextArea, [text]);

  return {
    textAreaRef,
    resizeTextArea,
  };
};
