import React, { ReactNode } from 'react'

const HelpDeskConversationLayout = ({ children }: { children: ReactNode }) => {

    return (
        <div className="flex w-full h-main-container-height md:max-w-7xl mx-auto shadow-md">
            {children}
        </div>
    )
}
export default HelpDeskConversationLayout
