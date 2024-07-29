'use client';

import { useGetFormData } from '@/features/conversation-forms/hooks/use-get-form-data';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react';
import CreateOrEditBusinessForm from '../_components/form-creation/create-form';
import { useGetFormHelpdesk } from '@/features/conversation-forms/hooks/use-get-form-helpdesk';

export default function Layout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const params = useParams();
  const formId = params?.formId as string;
  const spaceId = searchParams?.get('spaceId') as string;
  const modal = searchParams?.get('modal');
  const { data: form, isLoading } = useGetFormHelpdesk({
    formId,
  });
  if (modal === 'edit' && form && !isLoading) {
    console.log('form :>>', form);
    return (
      <div className="background-business-forms flex h-screen  flex-col overflow-hidden ">
        <CreateOrEditBusinessForm open currentForm={form} />
      </div>
    );
  }
  return <div className="h-full w-full ">{children}</div>;
}
