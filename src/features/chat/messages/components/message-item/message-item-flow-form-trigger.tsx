'use client';

import { Button } from '@/components/actions';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import { announceToParent } from '@/utils/iframe-util';
import { FileText } from 'lucide-react';
import React from 'react';

export default function MessageItemFlowFormTrigger({
  form,
  guestId,
}: {
  form: {
    _id: string;
    name: string;
  };
  guestId?: string;
}) {
  const formId = form._id;

  const openIframeForm = () => {
    if (guestId) {
      announceToParent({
        type: 'init-from-extension',
        payload: {
          urlToForm: `${NEXT_PUBLIC_URL}/extension-form?formId=${formId}&guestId=${guestId}`,
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
          {form.name}
        </Button>
      </div>
    </div>
  );
}
