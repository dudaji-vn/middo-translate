"use client"

import { Typography } from "@/components/data-display";
import Link from "next/link";

export enum EStatisticErrors {
  NO_ANALYSTIC_DATA = "NO_ANALYSTIC_DATA",
  NEXT_NOT_FOUND = "NEXT_NOT_FOUND"
}

export default function CustomError({ error }: { error: Error }) {
  
  if (error.message == EStatisticErrors.NO_ANALYSTIC_DATA)
    return <div className='m-auto py-10'>
      <Typography variant='h4' className='mb-5'>No data found</Typography>
      <Typography className='mb-5'>Some data is missing. Please try again later. </Typography>
      <Link href="/business/settings" className='underline text-primary-500-main'>
        Go to settings
      </Link>
    </div>
  if (error.message == EStatisticErrors.NEXT_NOT_FOUND)
    return <div className='m-auto py-10'>
      <Typography variant='h4' className='mb-5'>No extension found</Typography>
      <Typography className='mb-5'>You need to create a business to see statistics. </Typography>
      <Link href="/business/settings" className='underline text-primary-500-main'>
        Go to settings
      </Link>
    </div>

  console.error('Statistic error', error);
  return <div className='m-auto py-10'>
    <Typography variant='h4' className='mb-5'>An error occurred</Typography>
    <Typography className='mb-5'>Please try again later. </Typography>
    <Link href="/business" className='underline text-primary-500-main'>
      Go back
    </Link>
  </div>
}