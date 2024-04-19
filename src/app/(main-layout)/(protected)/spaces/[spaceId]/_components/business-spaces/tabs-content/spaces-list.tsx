import { Button } from '@/components/actions'
import { Typography } from '@/components/data-display'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link, { LinkProps } from 'next/link'
import React from 'react'
import { BusinessTabType, TSpace, TSpaceTag } from '..'
import Space from './space-card/space'
import { useAuthStore } from '@/stores/auth.store'
import SpacesListSkeletons from '../skeletons/spaces-list-skeletons'
import { ROUTE_NAMES } from '@/configs/route-name'
import { cn } from '@/utils/cn'

function EmptyContent({ createProps, ...props }: {
    createProps?: Omit<LinkProps, 'href'> & React.HTMLAttributes<HTMLAnchorElement>
} & React.HTMLAttributes<HTMLDivElement>
) {
    return <div  {...props} className={cn('w-full h-full flex gap-3 flex-col items-center justify-center', props.className)}>
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
        <Link href={ROUTE_NAMES.SPACES + '?modal=create-space'} {...createProps}>
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


const SpacesList = ({ loading = false, spaces, tab }: {
    spaces: TSpace[],
    tab?: BusinessTabType
    loading?: boolean
}) => {
    const currentUser = useAuthStore((s) => s.user);
    if (!loading && (!spaces || spaces.length === 0)) {
        return <EmptyContent className={tab === 'joined_spaces' ? 'hidden' : ''} />
    }

    return (
        <div className='px-[5vw] py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
            {loading && <SpacesListSkeletons count={3} />}
            {spaces?.map((space, index) => {
                return (
                    <Space key={space._id} data={space} tag={currentUser?._id === space.owner?._id ? 'my' : 'joined'} />
                )
            })}
        </div>
    )
}

export default SpacesList