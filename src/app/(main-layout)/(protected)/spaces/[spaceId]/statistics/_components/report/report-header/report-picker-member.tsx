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

const ReportPickerMember = ({ ...props }: ReportPickerMemberProps) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const searchParams = useSearchParams();
  const current = new URLSearchParams(
    Array.from(searchParams?.entries() || []),
  );
  const currentMember = searchParams?.get('member');
  const { space } = useAuthStore();
  const router = useRouter();
  const [selectedMember, setSelectedMember] = useState<DropdownOption>();
  const options = useMemo(() => {
    return (space?.members.map((member) => ({
      name: member.email,
      value: member._id,
    })) || []) as DropdownOption[];
  }, [space]);

  const onSelectMember = (option: DropdownOption) => {
    if (option.value) {
      current.set('member', option.value);
    } else {
      current.delete('member');
    }
    const href = `${ROUTE_NAMES.SPACES}/${space?._id}/statistics?${current.toString()}`;
    router.push(href);
  };
  useEffect(() => {
    if (currentMember) {
      setSelectedMember(
        options.find((option) => option.value === currentMember),
      );
    } else {
      setSelectedMember(OPTION_ALL);
    }
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
