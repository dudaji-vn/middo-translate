import React from 'react'

const BusinessConversation = ({params:  {conversationType}}: {params: {conversationType: string}}) => {
  return (
    <div>{conversationType}</div>
  )
}

export default BusinessConversation

