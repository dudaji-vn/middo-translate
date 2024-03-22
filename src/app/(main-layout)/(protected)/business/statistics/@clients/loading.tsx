import { Spinner } from '@/components/feedback'
import { cn } from '@/utils/cn'
import React from 'react'

const loading = () => {
  return (
    <div
      className={cn(
        'absolute inset-0 py-4 z-[999] flex items-center justify-center bg-black/20',
      )}
    >
      <Spinner size={'md'} className='m-auto text-primary-500-main' />
    </div>
  )
}
export default loading