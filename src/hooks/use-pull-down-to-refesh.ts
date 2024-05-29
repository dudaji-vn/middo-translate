import { useEffect } from 'react';
import toast from 'react-hot-toast';

export function usePullToRefresh({
  ref,
  onRefresh,
  disable,
}: {
  ref: React.RefObject<HTMLElement>;
  onRefresh?: () => void;
  disable?: boolean;
}) {
  useEffect(() => {
    if (disable) return;
    const el = ref?.current;
    if (!el) return;

    // attach the event listener
    el.addEventListener('touchstart', handleTouchStart);

    function handleTouchStart(startEvent: TouchEvent) {
      const el = ref.current;
      if (!el) return;

      // Check if the element is scrolled to the top
      if (el.scrollTop > 0) return;

      // get the initial Y position
      const initialY = startEvent.touches[0].clientY;

      el.addEventListener('touchmove', handleTouchMove);
      el.addEventListener('touchend', handleTouchEnd);

      function handleTouchMove(moveEvent: TouchEvent) {
        const el = ref.current;
        if (!el) return;

        // get the current Y position
        const currentY = moveEvent.touches[0].clientY;

        // get the difference
        const dy = currentY - initialY;

        const parentEl = el.parentNode as HTMLDivElement;

        if (dy > TRIGGER_THRESHOLD) {
          flipArrow(parentEl);
        } else if (dy > SHOW_INDICATOR_THRESHOLD) {
          addPullIndicator(parentEl);
        } else {
          removePullIndicator(parentEl);
        }

        if (dy < 0) return;

        // now we are using the `appr` function
        el.style.transform = `translateY(${appr(dy)}px)`;
      }

      function handleTouchEnd(endEvent: TouchEvent) {
        const el = ref.current;
        if (!el) return;

        // return the element to its initial position
        el.style.transform = 'translateY(0)';
        removePullIndicator(el.parentNode as HTMLDivElement);

        // add transition
        el.style.transition = 'transform 0.2s';

        // run the callback
        const y = endEvent.changedTouches[0].clientY;
        const dy = y - initialY;
        if (dy > TRIGGER_THRESHOLD) {
          toast.success('Refreshing...');
          onRefresh?.();
        }

        // listen for transition end event
        el.addEventListener('transitionend', onTransitionEnd);

        // cleanup
        el.removeEventListener('touchmove', handleTouchMove);
        el.removeEventListener('touchend', handleTouchEnd);
      }

      function onTransitionEnd() {
        const el = ref.current;
        if (!el) return;

        // remove transition
        el.style.transition = '';

        // cleanup
        el.removeEventListener('transitionend', onTransitionEnd);
      }
    }

    return () => {
      // let's not forget to cleanup
      el.removeEventListener('touchstart', handleTouchStart);
    };
  }, [ref, disable]);

  function addPullIndicator(el: HTMLDivElement) {
    //
  }

  function removePullIndicator(el: HTMLDivElement) {
    //
  }

  function flipArrow(el: HTMLDivElement) {
    //
  }
}

const MAX = 128;
const k = 0.4;

function appr(x: number) {
  return MAX * (1 - Math.exp((-k * x) / MAX));
}

const TRIGGER_THRESHOLD = 200;
const SHOW_INDICATOR_THRESHOLD = 50;
