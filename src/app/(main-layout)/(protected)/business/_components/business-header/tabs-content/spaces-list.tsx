import { Button } from '@/components/actions'
import { Typography } from '@/components/data-display'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link, { LinkProps } from 'next/link'
import React from 'react'
import { BusinessTabType, TSpace, TSpaceTag } from '../business-spaces'
import Space from './space-card/space'
import { useAuthStore } from '@/stores/auth.store'
import SpacesListSkeletons from '../skeletons/spaces-list-skeletons'

function EmptyContent({ createProps }: {
    createProps: Omit<LinkProps, 'href'> & React.HTMLAttributes<HTMLAnchorElement>
}) {
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
        <Link href='/business?modal=create-space' {...createProps}>
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

// TODO: Remove mock data
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
            avatar: '/logo.png',
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
            avatar: '/logo.png',
            language: 'en',
            status: 'active'
        }
    }
]
const SpacesList = ({ loading = false, spaces, tab }: {
    spaces: TSpace[],
    tab?: BusinessTabType
    loading?: boolean
}) => {
    const currentUser = useAuthStore((s) => s.user);
    if (!loading && (!spaces || spaces.length === 0)) {
        return <EmptyContent createProps={{
            className: tab === 'joined_spaces' ? 'hidden' : ''
        }} />
    }

    return (
        <div className='px-[5vw] py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
            {loading && <SpacesListSkeletons count={3} />}
            {spaces?.map((space, index) => {
                console.log('space', space._id)
                return (
                    <Space key={space._id} data={space} tag={currentUser?._id === space.owner?._id ? 'my' : 'joined'} />
                )
            })}
        </div>
    )
}

export default SpacesList