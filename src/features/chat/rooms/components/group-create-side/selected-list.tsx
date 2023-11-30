import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { SelectedItem } from './selected-item';
import { useGroupCreate } from './context';

export interface SelectedListProps {}

export const SelectedList = (props: SelectedListProps) => {
  const { selectedUsers, handleUnSelectUser } = useGroupCreate();
  const selectedRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollTo({
        left: selectedRef.current?.scrollWidth,
        behavior: 'smooth',
      });
    }
  }, [selectedUsers]);

  return (
    <AnimatePresence>
      {selectedUsers.length > 0 && (
        <motion.div
          initial={{
            opacity: 0,
            height: 0,
          }}
          animate={{
            opacity: 1,
            height: 'auto',
          }}
          exit={{
            opacity: 0,
            height: 0,
          }}
          ref={selectedRef}
          className="flex gap-8 overflow-x-auto overflow-y-hidden"
        >
          <AnimatePresence>
            {selectedUsers.map((user) => (
              <motion.div
                className="mt-5"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                key={user._id}
              >
                <SelectedItem
                  onClick={() => handleUnSelectUser(user)}
                  user={user}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
