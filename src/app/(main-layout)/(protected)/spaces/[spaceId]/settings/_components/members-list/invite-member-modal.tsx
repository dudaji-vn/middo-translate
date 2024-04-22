import React from 'react'
import InviteMembers from '../../../_components/spaces-crud/sections/invite-section'
import { TSpace } from '../../../_components/business-spaces'
import { Member } from '../../../_components/spaces-crud/sections/members-columns'
import { Button } from '@/components/actions'
import { UserRoundPlus } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

const InviteMemberModal = ({
    space
}: {
    space: TSpace;
}) => {
    const [members, setMembers] = React.useState<Member[]>([]);
    const [open, setOpen] = React.useState(false);
    const onInviteUsers = async () => {
        console.log('members', members)
    }
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
                <DialogContent className="h-fit  max-w-screen-md">
                    <DialogTitle className="flex flex-row items-center justify-between text-2xl font-semibold tracking-tight">
                        Invite Members
                    </DialogTitle>
                    <InviteMembers
                        className='h-auto'
                        header={<></>}
                        spacePreviewProps={{
                            className: 'hidden'
                        }}
                        blackList={space.members.map(member => member.email)}
                        space={{ ...space, members }}
                        setMembers={(members: Member[]) => {
                            setMembers(members)
                        }}
                    />
                    <div className='flex flex-row gap-3 py-2 justify-end'>
                        <Button
                            onClick={() => setOpen(false)}
                            color={'default'}
                            shape={'square'}
                            size={'sm'} >
                            Cancel
                        </Button>
                        <Button
                            onClick={onInviteUsers}
                            color={'primary'}
                            shape={'square'}
                            size={'sm'} >
                            Invite
                        </Button>
                    </div>

                </DialogContent>
            </Dialog>
        </>
    )
}

export default InviteMemberModal