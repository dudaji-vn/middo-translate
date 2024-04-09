import Tooltip from '@/components/data-display/custom-tooltip/tooltip'
import React from 'react'

const Ping = ({ message, ...props }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { message: string }) => {

    return (
        <div className='absolute -top-3 -left-3' {...props}>
            <Tooltip title={message} triggerItem={
                <span className="relative flex h-[16px] w-[16px]">
                    <span className="animate-ping absolute duration-700 inline-flex h-full w-full rounded-full bg-error-300 opacity-75"></span>
                    <span className="absolute inset-[4px] rounded-full h-[8px] w-[8px] bg-error-500"></span>
                </span>} 
                contentProps={{
                    className: 'bg-error-300 text-white px-4 py-2 rounded-xl text-xs',
                }}
                />
        </div>
    )
}

export default Ping