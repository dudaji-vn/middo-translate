'use client';

import React from 'react';
import InviteMembers from '../../../_components/spaces-crud/sections/invite-section';
import { TSpace } from '../../../_components/business-spaces';
import { Member } from '../../../_components/spaces-crud/sections/members-columns';
import { Button } from '@/components/actions';
import { UserRoundPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { inviteMembersToSpace } from '@/services/business-space.service';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const InviteMemberModal = ({ space }: { space: TSpace }) => {
  const [members, setMembers] = React.useState<Member[]>([]);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const onInviteUsers = async () => {
    try {
      await inviteMembersToSpace({
        members: members.map(({ email, role }) => ({ email, role })),
        spaceId: space._id,
      });
      toast.success('Members invited successfully');
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error('Error inviting members. Please try again');
    }
  };
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        shape={'square'}
        size={'xs'}
        startIcon={<UserRoundPlus />}
      >
        Invite Member
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-fit max-h-fit max-w-screen-md">
          <DialogTitle className="flex flex-row items-center justify-between text-2xl font-semibold tracking-tight">
            Invite Members
          </DialogTitle>
          <InviteMembers
            className="h-auto"
            header={<></>}
            spacePreviewProps={{
              className: 'hidden',
            }}
            blackList={space.members.map((member) => member.email)}
            space={{ ...space, members }}
            setMembers={(members: Member[]) => {
              setMembers(members);
            }}
          />
          <div className="flex flex-row justify-end gap-3 py-2">
            <Button
              onClick={() => setOpen(false)}
              color={'default'}
              shape={'square'}
              size={'sm'}
            >
              Cancel
            </Button>
            <Button
              onClick={onInviteUsers}
              color={'primary'}
              shape={'square'}
              size={'sm'}
            >
              Invite
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteMemberModal;
