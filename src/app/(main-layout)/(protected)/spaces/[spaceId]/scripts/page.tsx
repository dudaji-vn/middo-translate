'use client';

import React, { useState } from 'react';

import ScriptsList from './_components/scripts-list/scripts-list';
import { useRouter } from 'next/navigation';
import { useGetConversationScripts } from '@/features/conversation-scripts/hooks/use-get-conversation-scripts';
import { ChatScript } from './_components/column-def/scripts-columns';

const Page = ({
  params: { spaceId },
}: {
  params: {
    spaceId: string;
  };
}) => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const onSearchChange = (search: string) => {
    setSearch(search);
  };
  const { data, isLoading } = useGetConversationScripts({
    search,
    spaceId,
  });
  const scripts: ChatScript[] = data?.items || [];
  return (
    <ScriptsList
      scripts={scripts}
      onSearchChange={onSearchChange}
      search={search}
      isLoading={isLoading}
    />
  );
};

export default Page;
