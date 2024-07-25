'use client';

import { FormDetail } from '@/app/extension-form/_components/form-detail';
import { Button } from '@/components/actions';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import { useGetFormHelpdesk } from '@/features/conversation-forms/hooks/use-get-form-helpdesk';
import { announceToParent } from '@/utils/iframe-util';
import { FileText } from 'lucide-react';
import React from 'react';

export default function MessageItemFlowFormTrigger({
  formId,
  guestId,
}: {
  formId: string;
  guestId?: string;
}) {
  const { data: form, isLoading } = useGetFormHelpdesk({ formId });

  if (isLoading || !form) {
    return null;
  }
  const { name } = form as FormDetail;

  const openIframeForm = () => {
    if (guestId) {
      announceToParent({
        type: 'open-form',
        payload: {
          urlToForm: `${NEXT_PUBLIC_URL}/form?formId=${formId}&guestId=${guestId}`,
        },
      });
    }
  };
  return (
    <div className="relative space-y-2">
      <div className="relative w-fit min-w-10 overflow-hidden rounded-[20px] bg-neutral-50 px-2 py-1">
        <Button
          className="py-1  hover:underline"
          shape={'square'}
          size={'xs'}
          variant={'ghost'}
          startIcon={<FileText />}
          onClick={openIframeForm}
        >
          {name}
        </Button>
      </div>
    </div>
  );
}
