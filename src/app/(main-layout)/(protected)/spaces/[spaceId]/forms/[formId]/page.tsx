'use client';

import { useGetFormData } from '@/features/conversation-forms/hooks/use-get-form-data';
import React, { useMemo, useState } from 'react';
import {
  BusinessForm,
  DEFAULT_FORMS_PAGINATION,
  ROWS_PER_PAGE_OPTIONS,
} from '@/types/forms.type';
import { Tabs, TabsList, TabsTrigger } from '@/components/navigation';
import { isEmpty } from 'lodash';
import { cn } from '@/utils/cn';
import StepWrapper from '../_components/form-creation/step-wrapper';
import { FormDetail, Submissions } from './_components';
import {
  getFormsTablePerpage,
  setFormsTablePerpage,
} from '@/utils/local-storage';
import ClientSidePagination from '@/components/actions/pagination/client-side-pagination';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { DetailFormHeader } from '../_components/form-creation/detail-form-header';
import usePlatformNavigation from '@/hooks/use-platform-navigation';
import { extensionsCustomThemeOptions } from '../../settings/_components/extension-creation/sections/options';

const tabs = ['Submissions', 'Form'];
const FormPage = ({
  params: { formId, spaceId },
}: {
  params: {
    formId: string;
    spaceId: string;
  };
}) => {
  const [currentPage, setCurrentPage] = useState(
    DEFAULT_FORMS_PAGINATION.currentPage,
  );
  const [limit, setLimit] = useState(getFormsTablePerpage());
  const [search, setSearch] = useState('');
  const pathname = usePathname();
  const { navigateTo } = usePlatformNavigation();
  const { t } = useTranslation('common');
  const { data, isLoading } = useGetFormData({
    spaceId,
    formId,
    currentPage,
    search,
    limit,
  });
  const { submissions, formFields, totalPage } = data || {
    submissions: [],
    formFields: [],
    totalPage: 0,
  };
  const [tabValue, setTabValue] = React.useState<number>(0);
  const { overrideTheme, bgImageSrc } = useMemo(() => {
    const overrideTheme =
      extensionsCustomThemeOptions.find(
        (theme) =>
          theme.hex === data?.customize?.theme ||
          theme.name === data?.customize?.theme,
      )?.name || '';

    const bgImageSrc = data?.customize?.background || '/forms/bg-form-1.jpg';
    return { overrideTheme, bgImageSrc };
  }, [data?.customize]);

  const pagination = {
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

  if (!isLoading && (isEmpty(data) || !formFields || !submissions)) {
    return null;
  }

  return (
    <Tabs
      value={tabValue?.toString()}
      className={cn(
        'flex h-full w-full flex-1 flex-col overflow-hidden p-4 pb-20 md:px-[5vw]',
        overrideTheme,
      )}
      defaultValue={tabValue.toString()}
      onValueChange={(value) => {
        setTabValue(parseInt(value));
      }}
      style={{
        backgroundImage: `url(${bgImageSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <DetailFormHeader
        action="view"
        onOkClick={() => {
          navigateTo(String(pathname), new URLSearchParams({ modal: 'edit' }));
        }}
      />
      <TabsList className="mx-auto flex max-h-full w-[400px] max-w-full flex-row  items-center justify-center gap-3 border-none  md:justify-between ">
        {tabs.map((_, i) => {
          const isSelected = tabValue === i;
          return (
            <TabsTrigger
              key={i}
              value={i.toString()}
              variant="button"
              className={cn('rounded-t-lg bg-white max-md:w-fit max-md:px-3')}
            >
              {tabs[i]}
            </TabsTrigger>
          );
        })}
      </TabsList>
      <section
        className={cn(
          'flex flex-1 flex-col overflow-hidden p-3',
          'mx-auto w-full  rounded-2xl border-none bg-white shadow-[2px_4px_16px_2px_rgba(22,22,22,0.1)] dark:bg-[#030303]',
        )}
      >
        <div className="flex w-full flex-1 flex-col">
          <StepWrapper value="0" isLoading={isLoading}>
            <Submissions
              {...(data as BusinessForm)}
              className="h-full grow"
              allowRunForm
            />
            <ClientSidePagination
              pagination={pagination}
              limitOptions={ROWS_PER_PAGE_OPTIONS}
              onPageChange={onPageChange}
              onLimitChange={onLimitChange}
              className="h-14  flex-none"
            />
          </StepWrapper>
          <StepWrapper value="1" isLoading={isLoading}>
            <FormDetail formFields={formFields} name={String(data?.name)} />
          </StepWrapper>
        </div>
      </section>
    </Tabs>
  );
};

export default FormPage;
