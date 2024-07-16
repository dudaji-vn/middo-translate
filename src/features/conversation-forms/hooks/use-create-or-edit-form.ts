import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GET_CONVERSATION_FORMS_KEY } from './use-get-business-forms';
import customToast from '@/utils/custom-toast';
import { createOrEditBusinessForm } from '@/services/forms.service';

export const useCreateOrEditForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrEditBusinessForm,
    onSuccess: () => {
      customToast.success('Form saved successfully');
      queryClient.invalidateQueries([GET_CONVERSATION_FORMS_KEY]);
    },
    onError: () => {
      customToast.error('Failed to save forms');
    },
  });
};
