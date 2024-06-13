import { forwardRef, useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
export interface JayTextAnimationProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const topTexts = [
  'To break all',
  'Phá vỡ mọi',
  '모두 깨뜨리려면',
  '去打破一切',
  'Pour tout casser',
];

const bottomTexts = [
  'languages boundary',
  'rào cản ngôn ngữ',
  '언어 경계',
  '语言边界',
  'frontière des langues',
];

export const JayTextAnimation = forwardRef<
  HTMLDivElement,
  JayTextAnimationProps
>((props, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleInterval = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % topTexts.length);
  };
  useEffect(() => {
    const intervalId = setInterval(handleInterval, 3000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <>
      <AnimatePresence mode="popLayout">
        <motion.h1
          key={currentIndex + 'top'}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 0.8 }}
          transition={{ duration: 0.7, type: 'spring' }}
          exit={{ y: -50, opacity: 0 }}
          className="w-full text-center text-[32px] font-bold md:text-left md:text-[64px]  dark:text-neutral-50"
        >
          {topTexts[currentIndex]}
        </motion.h1>
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        <motion.h1
          key={currentIndex + 'bottom'}
          exit={{ y: 50, opacity: 0 }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 0.8 }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="w-full text-center text-[32px] font-bold text-primary md:text-left md:text-[64px]"
        >
          {bottomTexts[currentIndex]}
        </motion.h1>
      </AnimatePresence>
    </>
  );
});
JayTextAnimation.displayName = 'JayTextAnimation';
