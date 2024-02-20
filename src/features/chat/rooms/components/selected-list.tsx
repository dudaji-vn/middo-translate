import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { User } from '@/features/users/types';
import { UserSelectedItem } from '@/features/users/components/user-item.selected';

export interface SelectedListProps {
  items: User[];
  onItemClick: (user: User) => void;
}

export const SelectedList = ({ items, onItemClick }: SelectedListProps) => {
  const selectedRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollTo({
        left: selectedRef.current?.scrollWidth,
        behavior: 'smooth',
      });
    }
  }, [items]);

  return (
    <AnimatePresence>
      {items.length > 0 && (
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
          className="flex max-w-[460px] gap-8 overflow-x-auto overflow-y-hidden"
        >
          <AnimatePresence>
            {items.map((user) => (
              <motion.div
                className="mt-5"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                key={user._id}
              >
                <UserSelectedItem
                  onClick={() => onItemClick(user)}
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
