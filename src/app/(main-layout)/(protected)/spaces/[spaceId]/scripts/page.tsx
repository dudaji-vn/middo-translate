'use client';

import React, { useState } from 'react';

import ScriptsList from './_components/scripts-list/scripts-list';
import { useRouter } from 'next/navigation';
import { useGetConversationScripts } from '@/features/conversation-scripts/hooks/use-get-conversation-scripts';
import { ChatScript } from './_components/column-def/scripts-columns';
import ScriptsPagination, {
  ScriptPagination,
} from './_components/scripts-list/pagination/clients-pagination';
import {
  DEFAULT_SCRIPTS_PAGINATION,
  ROWS_PER_PAGE_OPTIONS,
} from '@/types/scripts.type';
import {
  getScriptsTablePerpage,
  setScriptsTablePerpage,
} from '@/utils/local-storage';

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
  const [currentPage, setCurrentPage] = useState(
    DEFAULT_SCRIPTS_PAGINATION.currentPage,
  );

  const [limit, setLimit] = useState(getScriptsTablePerpage());
  const { data, isLoading } = useGetConversationScripts({
    search,
    spaceId,
    limit,
    currentPage,
  });
  const totalPage = data?.totalPage || 0;
  const pagination: ScriptPagination = {
    limit: limit,
    currentPage,
    totalPage: totalPage || 0,
    nextPage: currentPage < totalPage ? currentPage + 1 : null,
    previousPage: currentPage > 1 ? currentPage - 1 : null,
    canNextPage: totalPage > 1 && currentPage < totalPage,
    canPreviousPage: totalPage > 1 && currentPage > 1,
  };

  const onLimitChange = (limit: number) => {
    setLimit(limit);
    setScriptsTablePerpage(limit);
    setCurrentPage(1);
  };
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  const scripts: ChatScript[] = data?.items || [];
  return (
    <>
      <ScriptsList
        scripts={scripts}
        onSearchChange={onSearchChange}
        search={search}
        isLoading={isLoading}
      />
      <ScriptsPagination
        pagination={pagination}
        limitOptions={ROWS_PER_PAGE_OPTIONS}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </>
  );
};

export default Page;
