import { Button } from '@/components/actions'
import { Typography } from '@/components/data-display'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { BusinessTabType, TSpace, TSpaceTag } from '../business-spaces'
import Space from './cards/space'
import { useAuthStore } from '@/stores/auth.store'

function EmptyContent() {
    return <div className='w-full h-full flex gap-3 flex-col items-center justify-center'>
        <Image
            src={`/empty-space.svg`}
            alt='empty-space'
            width={372}
            height={120}
            className='mx-auto'
        />
        <Typography className='text-neutral-800 font-semibold text-lg leading-5 text-center'>
            A little bit empty!
        </Typography>
        <Typography className='text-neutral-600 text-center'>
            Create a space so that you could invite another to manage your business
        </Typography>
        <Link href='/business?modal=create-space'>
            <Button
                variant={'default'}
                startIcon={<Plus className="h-4 w-4" />}
                color={'primary'}
                shape={'square'}
                className={'mt-5 w-fit'}
            >
                Create New Space
            </Button>
        </Link>
    </div>
}

const mockSpaces: TSpace[] = [
    {
        _id: '1',
        name: 'Dudaji',
        members: ['1', '2', '3'],
        newMessagesCount: 0,
        owner: {
            _id: '65ee747a5fe03631e57731f3',
            email: 'la@gmail.com',
            name: 'La',
            avatar: '/avatar.png',
            language: 'en',
            status: 'active'
        }
    },
    {
        _id: '2',
        name: 'Dudaji  VN',
        members: ['1', '2', '3'],
        newMessagesCount: 3,
        owner: {
            _id: '2',
            email: 'a@gmail.c',
            name: 'La22',
            avatar: '/avatar.png',
            language: 'en',
            status: 'active'
        }
    }
]
const SpacesList = ({ spaces = mockSpaces, tab }: {
    spaces?: TSpace[],
    tab?: BusinessTabType
}) => {
    const currentUser = useAuthStore((s) => s.user);
    if (tab === 'all_spaces' && (!spaces || spaces.length === 0)) {
        return <EmptyContent />
    }
    const showSpaces = spaces.filter((space) => {
        if (tab === 'my_spaces') {
            return currentUser?._id === space.owner._id
        }
        if (tab === 'joined_spaces') {
            return currentUser?._id !== space.owner._id
        }
        return true
    })
    return (
        <div className='px-[5vw] py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
            {showSpaces.map((space, index) => (
                <Space key={index} data={{ ...space, tag: currentUser?._id === space.owner._id ? 'my' : 'joined' }} />
            ))}
        </div>
    )
}

export default SpacesList