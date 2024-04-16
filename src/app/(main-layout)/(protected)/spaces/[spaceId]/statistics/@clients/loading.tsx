import { Spinner } from '@/components/feedback'
import { cn } from '@/utils/cn'
import React from 'react'

const ClientsLoading = () => {
  return (
    <div
      className={cn(
        'absolute inset-0 py-20 h-24 z-[999] flex items-center justify-cente',
      )}
    >
      <Spinner size={'md'} className='m-auto text-primary-500-main' />
    </div>
  )
}
export default ClientsLoading