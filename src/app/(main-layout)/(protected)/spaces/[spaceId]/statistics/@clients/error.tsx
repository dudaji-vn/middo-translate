"use client"

import Link from "next/link";
import { EStatisticErrors } from "../@report/error";

export default function CustomError({ error }: { error: Error }) {

  if (error.message == EStatisticErrors.NEXT_NOT_FOUND)
    return <div className='w-full px-6 bg-neutral-50 py-5'>
      <p className='w-full text-center'>No extension found. You need to create a business to see statistics. </p>
      <Link href="/settings" className='underline text-primary-500-main'>
        Go to settings
      </Link>
    </div>

  console.error('Statistic error', error);
  return <div className='w-full px-6 bg-neutral-50 py-5'>
    <p className='w-full text-center'>An error occurred.
      <Link href="/spaces" className='underline text-primary-500-main'>
        Go back
      </Link>
      </p>
  </div>
}