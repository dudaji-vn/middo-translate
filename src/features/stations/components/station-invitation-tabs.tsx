import { Member } from '@/app/(main-layout)/(protected)/stations/station-crud/sections';
import { Button } from '@/components/actions';
import {
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/data-entry';
import { Tabs, TabsList, TabsTrigger } from '@/components/navigation';
import { Label } from '@/components/ui/label';
import { searchApi } from '@/features/search/api';
import customToast from '@/utils/custom-toast';
import { TabsContent } from '@radix-ui/react-tabs';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface StationInvitationTabsProps {
  teams: { name: string }[];
  onAddMember?: (member: Member) => void;
  addedMembers?: Member[];
}

export const StationInvitationTabs = ({
  teams = [],
  onAddMember,
  addedMembers,
}: StationInvitationTabsProps) => {
  const { t } = useTranslation('common');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [team, setTeam] = useState('');
  const handleAddUser = async () => {
    if (!onAddMember) return;
    if (!isEmail(usernameOrEmail)) {
      const data = await searchApi.username({ q: usernameOrEmail });
      if (data.length === 0) {
        customToast.error(t('MESSAGE.ERROR.USER_NOT_FOUND'));
        return;
      }
      const user = data[0];
      if (
        addedMembers?.find(
          (m) =>
            m.usernameOrEmail === user.username ||
            m.usernameOrEmail === user.email,
        )
      ) {
        customToast.error(t('MESSAGE.ERROR.USER_ALREADY_ADDED'));
        return;
      }
    }

    const isAlreadyAdded = addedMembers?.find(
      (m) => m.usernameOrEmail === usernameOrEmail,
    );

    if (isAlreadyAdded) {
      customToast.error(t('MESSAGE.ERROR.USER_ALREADY_ADDED'));
      return;
    }

    onAddMember({
      usernameOrEmail,
      role: 'member',
      teamName: team,
    });
    setUsernameOrEmail('');
    setTeam('');
  };
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">
          {t('STATION.MEMBER.EMAIL_OR_USERNAME')}
        </TabsTrigger>
        <TabsTrigger value="password">Link</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="flex items-center gap-6 pt-5">
        <div className="grid flex-1 items-center gap-1.5">
          <Label
            htmlFor="email"
            className="text-neutral-600 dark:text-neutral-50"
          >
            {t('STATION.MEMBER.EMAIL_OR_USERNAME')}
          </Label>
          <Input
            className="h-11"
            name="emailOrUsername"
            placeholder="Enter email or username"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
        </div>
        <div className="grid items-center gap-1.5">
          <Label className="text-neutral-600 dark:text-neutral-50">Team</Label>
          <Select onValueChange={(value) => setTeam(value)} value={team}>
            <SelectTrigger className="h-11 w-[240px] rounded-xl">
              <SelectValue placeholder="Choose a team" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {teams.map((team) => (
                  <SelectItem key={team.name} value={team.name}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          disabled={!usernameOrEmail}
          color="secondary"
          shape="square"
          onClick={handleAddUser}
          endIcon={<PlusIcon className="mr-1 h-4 w-4" />}
          className="!max-sm:w-8 mt-auto h-11 min-w-28"
        >
          <span className="max-sm:hidden">{t('COMMON.ADD')}</span>
        </Button>
      </TabsContent>
    </Tabs>
  );
};

const isEmail = (value: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
};
