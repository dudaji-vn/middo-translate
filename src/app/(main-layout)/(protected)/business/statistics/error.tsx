"use client"

import { Typography } from "@/components/data-display";
import Link from "next/link";
import { EStatisticErrors } from "./@report/error";


export default function CustomError({ error }: { error: Error }) {
  if (error.message == EStatisticErrors.NEXT_NOT_FOUND)
    return <div className='w-full px-6 bg-neutral-50 py-5'>
      <Typography className="mx-auto">No extension found. You need to create a business to see statistics. </Typography>
      <Link href="/business/settings" className='underline text-primary-500-main'>
        Go to settings
      </Link>
    </div>

  return <div className='m-auto py-10'>
    <Typography variant='h5' className='mb-5'>An error occurred</Typography>
    <Typography className='mb-5'>Please try again later. </Typography>
    <Link href="/business" className='underline text-primary-500-main'>
      Go back
    </Link>
  </div>
}