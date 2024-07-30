'use client';

import { Button } from '@/components/actions';
import { NEXT_PUBLIC_URL } from '@/configs/env.public';
import { announceToParent } from '@/utils/iframe-util';
import { Check, FileCheck, FileText } from 'lucide-react';
import React from 'react';
import { Message } from '../../types';

export default function MessageItemFlowFormTrigger({
  guestId,
  message,
  form,
}: {
  guestId?: string;
  message: Message;
  form: {
    _id: string;
    name: string;
    isSubmitted?: boolean;
  };
}) {
  const formId = form._id;
  const isSubmitted = form.isSubmitted;

  const openIframeForm = () => {
    if (guestId) {
      announceToParent({
        type: 'init-from-extension',
        payload: {
          urlToForm: `${NEXT_PUBLIC_URL}/extension-form?formId=${formId}&guestId=${guestId}&messageId=${message._id}`,
        },
      });
    }
  };
  return (
    <div className="relative space-y-2 ">
      <div className="relative flex w-fit min-w-10 flex-row items-start overflow-hidden rounded-[20px]  bg-neutral-50 px-2 py-1  ">
        <Button
          className="py-1  hover:underline"
          shape={'square'}
          size={'xs'}
          variant={'ghost'}
          startIcon={isSubmitted ? <Check /> : <FileText />}
          onClick={openIframeForm}
        >
          {form.name}
        </Button>
      </div>
    </div>
  );
}
