'use client';

import { Globe } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import ReportDropdown, { DropdownOption } from '../../report-dropdown';
import { useAuthStore } from '@/stores/auth.store';

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

  return (
    <>
      <ReportDropdown
        open={openDropdown}
        onOpenChange={setOpenDropdown}
        selectedOption={selectedDomain}
        onSelectChange={(option) => {
          console.log(option);
          setSelectedDomain(option);
        }}
        options={[OPTION_ALL, ...options] as DropdownOption[]}
        startIcon={<Globe />}
      />
    </>
  );
};

export default ReportPickerDomain;
