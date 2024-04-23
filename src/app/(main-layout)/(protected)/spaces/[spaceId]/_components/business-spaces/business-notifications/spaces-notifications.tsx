import { Button } from '@/components/actions'
import React from 'react'
import { Bell } from 'lucide-react'
import Ping from '../ping/ping'

const SpacesNotifications = () => {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <Button.Icon
                variant={'default'}
                color={'default'}
                size={'xs'}
                className='relative'
            >
                <Ping className='absolute -top-[2px] -right-[8px]' size={12} />
                <Bell className='h-4 w-4' />
            </Button.Icon>
        </>
    )
}

export default SpacesNotifications