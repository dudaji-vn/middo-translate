import React, { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
    className ?: string
    [key: string]: any
}

export default function ButtonDataAction({ children, className, ...props }: Props & PropsWithChildren) {
  return (
    <div className={twMerge("rounded-xl bg-neutral-50 px-3 py-2 md:hover:bg-colors-neutral-100 cursor-pointer flex items-center outline-none text-neutral-700 stroke-neutral-700", className)} {...props}>
        {children}
    </div>
  )
}