"use client"

import { Typography } from "@/components/data-display";
import Link from "next/link";


export default function CustomError({ error }: { error: Error }) {
  return <div className='w-full px-6 bg-neutral-50 py-5'>
    <Typography className="mx-auto">{`It seems like you haven't created your extension yet. You need to create a business to see statistics.`}</Typography>
    <Link href="/settings" className='underline text-primary-500-main'>
      Go to settings
    </Link>
  </div>
}