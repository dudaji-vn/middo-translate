
import React, { useMemo } from 'react'
import { Typography } from '@/components/data-display'
import { Circle, Grip, GripVertical, Pen, Plus, Search, Trash2 } from 'lucide-react'

import TableSearch from '../../../statistics/_components/clients-table/table-search'
import { Button } from '@/components/actions'
import { TConversationTag } from '../../../_components/business-spaces'
import { cn } from '@/utils/cn'
import { CreateOrEditTag } from './create-or-edit-tag'
import { ConfirmDeleteTag } from './confirm-delete-tag'


type Tag = TConversationTag;

type TagItemProps = {
    onDelete: () => void;
    onEdit: () => void;
    editAble?: boolean;
    deleteAble?: boolean;
} & Tag & React.HTMLAttributes<HTMLDivElement>
const TagItem = ({ _id, name, color, isReadonly, onEdit, onDelete, editAble, deleteAble, ...props }: TagItemProps) => {
    return (<div className='w-full flex justify-between gap-10 flex-row items-center bg-primary-100 p-[8px_40px] rounded-[12px]' {...props}>
        <div className='w-full flex justify-start flex-row gap-10  items-center'>
            <Button.Icon size={'xs'} shape={'square'} variant={'ghost'} color={'default'}>
                <GripVertical className='stroke-neutral-500 fill-neutral-500' />
            </Button.Icon>
            <Circle
                size={16}
                className="text-neutral-500"
                stroke={color}
                fill={color}
            />
            <Typography className="text-neutral-800 text-base capitalize">{name}</Typography>
        </div >
        <div className={cn("min-w-10 px-4 flex flex-row items-center justify-end gap-2",
            { 'invisible': isReadonly }
        )}>
            <Button.Icon size={'xs'}
                className={editAble ? '' : 'invisible'}
                disabled={!editAble}
                color={'default'}
                onClick={onEdit}
            >
                <Pen />
            </Button.Icon>
            <Button.Icon size={'xs'}
                className={deleteAble ? '' : 'invisible'}
                disabled={!deleteAble}
                color={'default'}
                onClick={onDelete}
            >
                <Trash2 className="text-error" />
            </Button.Icon>
        </div>
    </div>
    )

}

enum TagModalType {
    CREATE_OR_EDIT = 'create-edit',
    DELETE = 'delete',
}
const TagsList = ({
    tags,
    spaceId
}: {
    tags: Tag[],
    spaceId: string
}) => {
    const [search, setSearch] = React.useState('');
    const [modalState, setModalState] = React.useState<{
        open: boolean;
        initTag: Tag | undefined;
        modalType?: TagModalType;
    }>({
        open: false,
        modalType: undefined,
        initTag: undefined,
    });

    const onSearchChange = (search: string) => {
        setSearch(search.trim());
    }
    const displayedTags = useMemo(() => {
        return tags?.filter(tag => tag.name.toLowerCase().includes(search.toLowerCase())) || [];
    }, [tags, search])


    return (<section className='flex flex-col gap-5 w-full items-end py-4'>
        <div className='w-full flex flex-row px-4 gap-5 justify-end items-center'>
            <div className='md:w-96 w-60 relative'>
                <TableSearch
                    className='py-2 min-h-[44px] w-full outline-neutral-100'
                    onSearch={onSearchChange}
                    search={search} />
                <Search size={16} className='text-neutral-700 stroke-[3px] absolute top-1/2 right-6 transform -translate-y-1/2' />
            </div>
            <Button
                onClick={() => setModalState({ open: true, initTag: undefined, modalType: TagModalType.CREATE_OR_EDIT })}
                shape={'square'}
                size={'sm'}
                variant={'ghost'}
                startIcon={<Plus />}>
                Add Tag
            </Button>
        </div>
        <div className='w-full rounded-md p-0 overflow-x-auto'>
            <div className='w-full flex flex-col gap-2'>
                {displayedTags.map((tag) => {
                    return <TagItem
                        key={tag._id}
                        {...tag}
                        editAble={true}
                        deleteAble={true}
                        onEdit={() => setModalState({ open: true, initTag: tag, modalType: TagModalType.CREATE_OR_EDIT })}
                        onDelete={() => setModalState({ open: true, initTag: tag, modalType: TagModalType.DELETE })}
                    />
                })}
            </div>
        </div>
        {modalState.modalType === TagModalType.CREATE_OR_EDIT && <CreateOrEditTag
            spaceId={spaceId}
            tags={tags}
            open={modalState.open}
            onOpenChange={(open) => setModalState({ open, initTag: modalState.initTag })}
            initTag={modalState.initTag}
        />}
        {modalState.initTag && modalState.modalType === TagModalType.DELETE && <ConfirmDeleteTag
            onOpenChange={(open) => setModalState({ open, initTag: modalState.initTag })}
            open={modalState.open}
            tag={modalState.initTag}
            spaceId={spaceId}
        />}
    </section>
    )
}

export default TagsList