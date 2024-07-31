import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_CONVERSATION_FORMS_KEY } from './use-get-business-forms';
import { deleteBusinessForms } from '@/services/forms.service';

export const useDeleteForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBusinessForms,
    onSuccess: () => {
      queryClient.invalidateQueries([GET_CONVERSATION_FORMS_KEY]);
    },
  });
};
