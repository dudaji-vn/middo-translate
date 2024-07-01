import { changeRoleMember } from '@/services/business-space.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { GET_SPACE_DATA_KEY } from './use-get-space-data';
import customToast from '@/utils/custom-toast';

export const useChangeRoleMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeRoleMember,
    onSuccess: () => {
      customToast.success('Change role member successfully');

      queryClient.invalidateQueries([GET_SPACE_DATA_KEY]);
    },
  });
};
