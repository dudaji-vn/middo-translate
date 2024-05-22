'use client';

import { Globe } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import ReportDropdown, { DropdownOption } from '../../report-dropdown';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTE_NAMES } from '@/configs/route-name';

export type DomainPickerType = string;

export type DomainPickerOptions = {
  type: DomainPickerType;
  spaceId: string;
} & {
  domains: string[];
};

export type ReportPickerDomainProps = {};
const OPTION_ALL = {
  name: 'All domains',
  value: null,
};

const nameField = 'domain';
const ReportPickerDomain = ({ ...props }: ReportPickerDomainProps) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { space } = useAuthStore();
  const [selectedDomain, setSelectedDomain] =
    useState<DropdownOption>(OPTION_ALL);
  const options = useMemo(() => {
    return (space?.extension?.domains?.map((domain: string) => ({
      name: domain,
      value: domain,
    })) || []) as DropdownOption[];
  }, [space]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const current = new URLSearchParams(
    Array.from(searchParams?.entries() || []),
  );
  const currentDomain = searchParams?.get(nameField);

  const onSelectDomain = (option: DropdownOption) => {
    if (option.value) {
      current.set(nameField, option.value);
    } else {
      current.delete(nameField);
    }
    const href = `${ROUTE_NAMES.SPACES}/${space?._id}/statistics?${current.toString()}`;
    console.log('href', href);
    router.push(href);
  };
  useEffect(() => {
    setSelectedDomain(
      options.find((option) => option.value === currentDomain) || OPTION_ALL,
    );
  }, [currentDomain]);

  return (
    <>
      <ReportDropdown
        open={openDropdown}
        onOpenChange={setOpenDropdown}
        selectedOption={selectedDomain}
        onSelectChange={onSelectDomain}
        options={[OPTION_ALL, ...options] as DropdownOption[]}
        startIcon={<Globe />}
      />
    </>
  );
};

export default ReportPickerDomain;
