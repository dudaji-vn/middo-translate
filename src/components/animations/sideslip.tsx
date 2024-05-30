import { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface SideslipProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sideslip = forwardRef<HTMLDivElement, SideslipProps>(
  (props, ref) => {
    return (
      <motion.div
        ref={ref}
          initial={{ left: '100%' }}
          animate={{ left: 0 }}
          exit={{ left: '100%' }}
          transition={{ duration: 0.2 }}
        className={props.className + ' relative'}
      >
        {props.children}
      </motion.div>
    );
  },
);
Sideslip.displayName = 'Sideslip';
