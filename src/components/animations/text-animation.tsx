import React, { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
interface TextAnimationProps {
  arrayText: string[];
  element: ReactElement;
  animateType: 'up' | 'down';
}
const TextAnimation = (props: TextAnimationProps) => {
  const { arrayText, element, animateType } = props;
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(arrayText[index]);
  const [key, setKey] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % arrayText.length);
    }, 2000);
    return () => clearInterval(intervalId);
  }, [arrayText.length]);
  useEffect(() => {
    setText(arrayText[index]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);
  return (
    <div className="">
      {React.cloneElement(
        element,
        {
          key: index,
          className: cn(
            element.props.className,
            animateType === 'up' ? 'animation-up' : 'animation-down',
          ),
        },
        text,
      )}
    </div>
  );
};
export default TextAnimation;
