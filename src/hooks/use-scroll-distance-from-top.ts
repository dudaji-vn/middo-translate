import { useEffect, useRef, useState } from 'react';

export function useScrollDistanceFromTop(threshold: number, isReverse = false) {
  const [isScrolled, setIsScrolled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const { scrollTop } = ref.current;
        if (isReverse) {
          setIsScrolled(scrollTop < threshold);
        } else {
          setIsScrolled(scrollTop > threshold);
        }
      }
    };

    if (ref.current) {
      ref.current.addEventListener('scroll', handleScroll);
    }

    let cleanup = () => {};
    if (ref.current) {
      ref.current.addEventListener('scroll', handleScroll);
      cleanup = () => {
        ref.current?.removeEventListener('scroll', handleScroll);
      };
    }
    return cleanup;
  }, [isReverse, ref, threshold]);

  return { ref, isScrolled };
}
