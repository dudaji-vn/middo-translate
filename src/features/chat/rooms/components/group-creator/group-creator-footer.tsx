import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/actions';
import { User } from '@/features/users/types';
import { useTranslation } from 'react-i18next';

const MIN_GROUP_MEMBERS_EXCEPT_SELF = 2;

export interface GroupCreateFooterProps {
  createLoading: boolean;
  selectedUsers: User[];
}

export const GroupCreateFooter = ({
  createLoading,
  selectedUsers,
}: GroupCreateFooterProps) => {
  const {t} = useTranslation('common')
  return (
    <AnimatePresence>
      {selectedUsers.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className={'mt-auto p-3 shadow-n-1'}
        >
          <Button
            disabled={selectedUsers.length < MIN_GROUP_MEMBERS_EXCEPT_SELF}
            size="md"
            shape="square"
            loading={createLoading}
            form="create-group-form"
            type="submit"
            className="w-full"
          >
            {t('COMMON.CREATE')}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
