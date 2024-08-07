'use client';

import { useGetFormData } from '@/features/conversation-forms/hooks/use-get-form-data';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useMemo } from 'react';
import CreateOrEditBusinessForm from '../_components/form-creation/create-form';
import { useGetFormHelpdesk } from '@/features/conversation-forms/hooks/use-get-form-helpdesk';
import { useAppStore } from '@/stores/app.store';
import { extensionsCustomThemeOptions } from '../../settings/_components/extension-creation/sections/options';
import { cn } from '@/utils/cn';

export default function Layout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const params = useParams();
  const formId = params?.formId as string;
  const spaceId = searchParams?.get('spaceId') as string;
  const modal = searchParams?.get('modal');
  const { themeTrial } = useAppStore();

  const { data: form, isLoading } = useGetFormHelpdesk({
    formId,
  });

  const overiddenTheme = useMemo(() => {
    const themeName =
      extensionsCustomThemeOptions.find(
        (theme) =>
          theme.hex === themeTrial?.theme || theme.name === themeTrial?.theme,
      )?.name || '';
    return themeName;
  }, [themeTrial]);
  if (modal === 'edit' && form && !isLoading) {
    return (
      <div
        className={cn(
          ' flex h-screen  flex-col overflow-hidden ',
          overiddenTheme,
        )}
        style={{
          backgroundImage: `url(${
            themeTrial?.background || '/forms/bg-form-1.jpg'
          })`,
        }}
      >
        <CreateOrEditBusinessForm open currentForm={form} />
      </div>
    );
  }
  return <div className="h-full w-full ">{children}</div>;
}
