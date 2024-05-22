'use client';

import { User } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { use, useEffect, useMemo, useState } from 'react';
import ReportDropdown, { DropdownOption } from '../../report-dropdown';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTE_NAMES } from '@/configs/route-name';

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
const nameField = 'memberId';
const ReportPickerMember = ({}: ReportPickerMemberProps) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { space } = useAuthStore();
  const options = useMemo(() => {
    return (space?.members.map((member) => ({
      name: member.email,
      value: member._id,
    })) || []) as DropdownOption[];
  }, [space]);
  const searchParams = useSearchParams();
  const current = new URLSearchParams(
    Array.from(searchParams?.entries() || []),
  );
  const currentMember = searchParams?.get(nameField);

  const router = useRouter();
  const [selectedMember, setSelectedMember] =
    useState<DropdownOption>(OPTION_ALL);

  const onSelectMember = (option: DropdownOption) => {
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
    setSelectedMember(
      options.find((option) => option.value === currentMember) || OPTION_ALL,
    );
  }, [currentMember]);

  return (
    <>
      <ReportDropdown
        open={openDropdown}
        onOpenChange={setOpenDropdown}
        selectedOption={selectedMember}
        onSelectChange={onSelectMember}
        options={[OPTION_ALL, ...options] as DropdownOption[]}
        startIcon={<User />}
      />
    </>
  );
};

export default ReportPickerMember;
