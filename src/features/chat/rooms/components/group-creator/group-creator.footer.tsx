import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/actions';
import { User } from '@/features/users/types';

export interface GroupCreateFooterProps {
  createLoading: boolean;
  selectedUsers: User[];
}

export const GroupCreateFooter = ({
  createLoading,
  selectedUsers,
}: GroupCreateFooterProps) => {
  return (
    <AnimatePresence>
      {selectedUsers.length > 1 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className={'p-3 shadow-n-1'}
        >
          <Button
            size="md"
            shape="square"
            loading={createLoading}
            form="create-group-form"
            type="submit"
            className="w-full"
          >
            Create
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
