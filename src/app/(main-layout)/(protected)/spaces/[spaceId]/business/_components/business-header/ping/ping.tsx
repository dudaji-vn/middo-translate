import { Circle } from 'lucide-react'
import React from 'react'

const Ping = ({
    hasNotification = true,
    size = 16,
    ...props
}: {
    hasNotification?: boolean,
    size?: number
} & React.HTMLAttributes<HTMLDivElement>
) => {
    return (
        <div className='absolute -top-1 right-[10px]' {...props}>
            <Circle size={size} className={hasNotification ? 'fill-primary-500-main absolute inset-0 stroke-primary-500-main animate-ping' : 'invisible'} />
            <Circle size={size} className={hasNotification ? 'fill-primary-500-main absolute inset-0 stroke-primary-500-main' : 'invisible'} />
        </div>
    )
}

export default Ping