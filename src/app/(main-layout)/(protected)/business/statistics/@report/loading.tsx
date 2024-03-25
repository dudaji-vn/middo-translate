import { Spinner } from '@/components/feedback'
import { cn } from '@/utils/cn'
import React from 'react'

const loading = () => {
  return (
    <div
    className={cn(
      'w-full h-60 z-[999] py-4 flex items-center justify-center',
    )}
  >
     <Spinner size={'md'} className='m-auto text-primary-500-main'/>
  </div>
  )
}
export default loading