"use client"

import { Typography } from "@/components/data-display";
import Link from "next/link";
import { EStatisticErrors } from "../@report/error";

export default function CustomError({ error }: { error: Error }) {

  if (error.message == EStatisticErrors.NO_ANALYSTIC_DATA)
    return <div className='w-full px-6 bg-neutral-50 py-5'>
      <p className='w-full text-center'>No analystic data found</p>
    </div>
  if (error.message == EStatisticErrors.NEXT_NOT_FOUND)
    return <div className='w-full px-6 bg-neutral-50 py-5'>
      <p className='w-full text-center'>No extension found. You need to create a business to see statistics. </p>
      <Link href="/business/settings" className='underline text-primary-500-main'>
        Go to settings
      </Link>
    </div>

  console.error('Statistic error', error);
  return <div className='m-auto py-10'>
    <Typography variant='h5' className='mb-5'>An error occurred</Typography>
    <Typography className='mb-5'>Please try again later. </Typography>
    <Link href="/business" className='underline text-primary-500-main'>
      Go back
    </Link>
  </div>
}