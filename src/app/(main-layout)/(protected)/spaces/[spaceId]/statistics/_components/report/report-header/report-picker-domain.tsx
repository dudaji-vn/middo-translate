'use client';

import { ChevronDown, Grid2X2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import ReportDropdown, { DropdownOption } from '../../report-dropdown';

export type DomainPickerType = string;

export type DomainPickerOptions = {
  type: DomainPickerType;
  spaceId: string;
} & {
  domains: string[];
};

export type ReportPickerDomainProps = {};

const ReportPickerDomain = ({ ...props }: ReportPickerDomainProps) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const router = useRouter();
  const params = useParams();

  // TODO: Implement member picker options
  const options: DropdownOption[] = [
    {
      name: 'DUDAJI VN',
      value: 'dudaji-vn',
    },
  ];

  return (
    <>
      <ReportDropdown
        open={openDropdown}
        onOpenChange={setOpenDropdown}
        selectedOption={options[0]}
        onSelectChange={(option) => {
          if (option.href) {
            router.push(option.href);
          }
        }}
        options={options}
        startIcon={<Grid2X2 />}
        endIcon={<ChevronDown className="size-4" />}
      />
    </>
  );
};

export default ReportPickerDomain;
