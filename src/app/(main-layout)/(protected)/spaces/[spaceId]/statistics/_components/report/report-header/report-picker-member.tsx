'use client';

import { User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTE_NAMES } from '@/configs/route-name';
import { ReportDropdown } from '../../report-dropdown';
import { DropdownOption } from '../../report-dropdown/report-dropdown';
import { useTranslation } from 'react-i18next';

export type MemberPickerType = string;

export type MemberPickerOptions = {
  type: MemberPickerType;
  spaceId: string;
} & {
  members: string[];
};

export type ReportPickerMemberProps = {};

const nameField = 'memberId';
const ReportPickerMember = ({}: ReportPickerMemberProps) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { t } = useTranslation('common');
  const { space } = useAuthStore();
  const OPTION_ALL = {
    name: t('EXTENSION.ALL_MEMBERS'),
    value: null,
  };
  const options = useMemo(() => {
    return (space?.members
      ?.filter(({ status }) => status === 'joined')
      ?.map((member) => ({
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
    router.push(href);
  };
  useEffect(() => {
    if (options?.length > 0) {
      if (!currentMember) {
        setSelectedMember(OPTION_ALL);
        return;
      }
      const foundOption = options.find(
        (option) => option.value === currentMember,
      );
      if (!foundOption) {
        current.delete(nameField);
        router.push(
          `${ROUTE_NAMES.SPACES}/${space?._id}/statistics?${current.toString()}`,
        );
        return;
      }
      setSelectedMember(foundOption);
    }
  }, [currentMember, options]);

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
