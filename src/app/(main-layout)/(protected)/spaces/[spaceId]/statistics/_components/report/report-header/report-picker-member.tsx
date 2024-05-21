'use client';

import { ChevronDown, User } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import ReportDropdown, { DropdownOption } from '../../report-dropdown';

export type MemberPickerType = string;

export type MemberPickerOptions = {
  type: MemberPickerType;
  spaceId: string;
} & {
  members: string[];
};

export type ReportPickerMemberProps = {};

const ReportPickerMember = ({ ...props }: ReportPickerMemberProps) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const router = useRouter();
  const params = useParams();
  // TODO: Implement member picker options
  const options: DropdownOption[] = [
    {
      name: 'HUyen Nguyen',
      value: 'huyenntt@dudaji.vn',
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
        startIcon={<User />}
        endIcon={<ChevronDown className="size-4" />}
      />
    </>
  );
};

export default ReportPickerMember;
