import { DataTable } from '@/components/ui/data-table'
import React from 'react'
import { Member, membersColumns } from './members-columns'
import { Typography } from '@/components/data-display'
import { UserCog, UserRound } from 'lucide-react'
const memberTableProps = {
    tableHeadProps: {
        className: 'bg-transparent'
    },
    rowProps: {
        className: 'rounded-full odd:bg-white even:bg-white'
    }
}

const MembersList = ({
    members
}: {
    members: Member[]
}) => {
    const onDelete = (member: Member) => {
        console.log('delete', member)
    }
    const onResendInvitation = (member: Member) => {
        console.log('resend', member)
    }
    return (<>
        <div className='w-full p-2 flex flex-row gap-3 items-center font-semibold bg-[#fafafa]'>
            <UserCog size={16}  className='text-primary-500-main stroke-[3px]' />
            <Typography className='text-primary-500-main '>
                Admin role
            </Typography>
        </div>
        <DataTable
            {...memberTableProps}
            columns={membersColumns({
                onDelete: onDelete,
                onResendInvitation: onResendInvitation
            })}
            data={members} />
        <div className='w-full  p-2 flex flex-row  gap-3 items-center font-semibold  bg-[#fafafa]'>
            <UserRound size={16} className='text-primary-500-main stroke-[3px]' />
            <Typography className='text-primary-500-main'>
                Member role
            </Typography>
        </div>
        <DataTable
            {...memberTableProps}
            columns={membersColumns({
                onDelete: onDelete,
                onResendInvitation: onResendInvitation
            })}
            data={members} />
    </>
    )
}

export default MembersList