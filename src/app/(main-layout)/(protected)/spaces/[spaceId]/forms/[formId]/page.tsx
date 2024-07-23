'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetFormData } from '@/features/conversation-forms/hooks/use-get-form-data';
import React from 'react';
import { DEFAULT_FORMS_PAGINATION } from '@/types/forms.type';
import FormDetailSkeleton from './_components/skeletons/form-detail-skeleton';
import Submissions from './_components/submissions/submissions';

const FormDetail = ({
  params: { formId, spaceId },
}: {
  params: {
    formId: string;
    spaceId: string;
  };
}) => {
  const { data, isLoading } = useGetFormData({ spaceId, formId });

  if (isLoading) {
    return <FormDetailSkeleton rows={DEFAULT_FORMS_PAGINATION.limit} />;
  }

  return <Submissions submissions={[]} />;
};

export default FormDetail;
