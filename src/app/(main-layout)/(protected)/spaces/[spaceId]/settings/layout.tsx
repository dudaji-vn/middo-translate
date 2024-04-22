import React from 'react'

const Layout = ({ children }: {
    children: React.ReactNode;
}
) => {
    return (
        <div className=' w-full bg-primary-100 h-main-container-height overflow-hidden'>
            {children}
        </div>
    )
}

export default Layout