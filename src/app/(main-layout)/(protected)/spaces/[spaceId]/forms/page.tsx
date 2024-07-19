'use client';

import React, { useState } from 'react';

import FormsList from './_components/form-list/forms-list';
import { useRouter } from 'next/navigation';
import { useGetBusinessForms } from '@/features/conversation-forms/hooks/use-get-business-forms';
import FormsPagination, {
  FormPagination,
} from './_components/form-list/pagination/forms-pagination';
import {
  BusinessForm,
  DEFAULT_FORMS_PAGINATION,
  ROWS_PER_PAGE_OPTIONS,
} from '@/types/forms.type';
import {
  getFormsTablePerpage,
  setFormsTablePerpage,
} from '@/utils/local-storage';
import CreateOrEditBusinessForm from './_components/form-creation/create-form';
import { isEmpty } from 'lodash';
import EmptyForms from './_components/form-list/empty-forms/empty-forms';

const Page = ({
  params: { spaceId },
  searchParams,
}: {
  params: {
    spaceId: string;
  };
  searchParams: {
    modal: 'create';
  };
}) => {
  const { modal } = searchParams;
  const router = useRouter();
  const [search, setSearch] = useState('');
  const onSearchChange = (search: string) => {
    setSearch(search);
  };
  const [currentPage, setCurrentPage] = useState(
    DEFAULT_FORMS_PAGINATION.currentPage,
  );

  const [limit, setLimit] = useState(getFormsTablePerpage());
  const { data, isLoading, isFetched } = useGetBusinessForms({
    search,
    spaceId,
    limit,
    currentPage,
  });
  const totalPage = data?.totalPage || 0;
  const pagination: FormPagination = {
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
    setFormsTablePerpage(limit);
    setCurrentPage(1);
  };
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  const forms: BusinessForm[] = data?.items || [];
  if (modal === 'create') {
    return (
      <div className="flex h-screen flex-col  overflow-hidden background-business-forms ">
        <CreateOrEditBusinessForm open={true} />
      </div>
    );
  }
  return (
    <>
      <FormsList
        forms={forms}
        onSearchChange={onSearchChange}
        search={search}
        isLoading={isLoading}
        tableWrapperProps={{
          className: 'md:px-10',
        }}
      />
      {isEmpty(forms) && isFetched ? (
        <EmptyForms />
      ) : (
        <FormsPagination
          pagination={pagination}
          limitOptions={ROWS_PER_PAGE_OPTIONS}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </>
  );
};

export default Page;
