'use client';

import React, { useMemo } from 'react';
import InviteMembers from '../../../_components/spaces-crud/sections/invite-section';
import { type TSpace } from '../../../_components/business-spaces';
import { type Member } from '../../../_components/spaces-crud/sections/members-columns';
import { Button } from '@/components/actions';
import { UserRoundPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { inviteMembersToSpace } from '@/services/business-space.service';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { ESPaceRoles } from '../space-setting/setting-items';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { GET_SPACE_DATA_KEY } from '@/features/business-spaces/hooks/use-get-space-data';

const InviteMemberModal = ({
  space,
  myRole,
}: {
  space: TSpace;
  myRole?: ESPaceRoles;
}) => {
  const { t } = useTranslation('common');
  const [members, setMembers] = React.useState<Member[]>([]);
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const onInviteUsers = async () => {
    setLoading(true);
    try {
      await inviteMembersToSpace({
        members: members.map(({ email, role }) => ({ email, role })),
        spaceId: space._id,
      });
      toast.success('Members invited successfully');
      setMembers([]);
      setOpen(false);
      queryClient.invalidateQueries([
        GET_SPACE_DATA_KEY,
        {
          spaceId: space._id,
        },
      ]);
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error('Error inviting members. Please try again');
    }
    setLoading(false);
  };
  const allowedRoles = useMemo(() => {
    switch (myRole) {
      case ESPaceRoles.Admin:
        return [ESPaceRoles.Member];
      case ESPaceRoles.Owner:
        return [ESPaceRoles.Admin, ESPaceRoles.Member];
      default:
        return [];
    }
  }, [myRole]);
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        shape={'square'}
        size={'xs'}
        startIcon={<UserRoundPlus />}
      >
        {t('EXTENSION.MEMBER.INVITE_MEMBER')}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-fit  max-h-[80vh] min-h-fit max-w-screen-md flex-col justify-start overflow-y-auto">
          <DialogTitle className="flex flex-row items-center justify-between text-2xl font-semibold tracking-tight">
            {t('EXTENSION.MEMBER.INVITE_MEMBER')}
          </DialogTitle>
          <InviteMembers
            className="h-auto max-h-[400px] overflow-y-auto"
            hideOwner
            header={<></>}
            spacePreviewProps={{
              className: 'hidden',
            }}
            allowedRoles={allowedRoles}
            blackList={space.members.map((member) => member.email)}
            space={{ ...space, members }}
            setMembers={(members: Member[]) => {
              setMembers(members);
            }}
          />
          <div className="flex h-fit flex-row justify-end gap-3 py-2">
            <Button
              onClick={() => {
                setMembers([]);
                setOpen(false);
              }}
              color={'default'}
              shape={'square'}
              size={'sm'}
            >
              {t('COMMON.CANCEL')}
            </Button>
            <Button
              onClick={onInviteUsers}
              color={members.length ? 'primary' : 'disabled'}
              shape={'square'}
              disabled={!members.length}
              loading={loading}
              size={'sm'}
            >
              {t('COMMON.INVITE')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteMemberModal;
