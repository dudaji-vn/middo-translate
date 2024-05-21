'use client';

import { User } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { use, useMemo, useState } from 'react';
import ReportDropdown, { DropdownOption } from '../../report-dropdown';
import { useAuthStore } from '@/stores/auth.store';

export type MemberPickerType = string;

export type MemberPickerOptions = {
  type: MemberPickerType;
  spaceId: string;
} & {
  members: string[];
};

export type ReportPickerMemberProps = {};
const OPTION_ALL = {
  name: 'All members',
  value: null,
};

const ReportPickerMember = ({ ...props }: ReportPickerMemberProps) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { space } = useAuthStore();
  const [selectedMember, setSelectedMember] =
    useState<DropdownOption>(OPTION_ALL);
  const options = useMemo(() => {
    return (space?.members.map((member) => ({
      name: member.email,
      value: member._id,
    })) || []) as DropdownOption[];
  }, [space]);

  return (
    <>
      <ReportDropdown
        open={openDropdown}
        onOpenChange={setOpenDropdown}
        selectedOption={selectedMember}
        onSelectChange={(option) => {
          console.log(option);
          setSelectedMember(option);
        }}
        options={[OPTION_ALL, ...options] as DropdownOption[]}
        startIcon={<User />}
      />
    </>
  );
};

export default ReportPickerMember;
