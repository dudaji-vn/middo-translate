import React from 'react'

const StatisticLayout = ({ report, clients, children }: {
    report: JSX.Element,
    clients: JSX.Element,
    children: JSX.Element
}) => {
    return (
        <main className='flex flex-col gap-4 w-full p-4'>
            {children}
            {report}
            {clients}
        </main>
    )
}

export default StatisticLayout