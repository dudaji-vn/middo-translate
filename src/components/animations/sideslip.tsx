import { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface SideslipProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Sideslip = forwardRef<HTMLDivElement, SideslipProps>(
  (props, ref) => {
    return (
      <motion.div
        ref={ref}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.2 }}
        className={props.className}
      >
        {props.children}
      </motion.div>
    );
  },
);
Sideslip.displayName = 'Sideslip';
