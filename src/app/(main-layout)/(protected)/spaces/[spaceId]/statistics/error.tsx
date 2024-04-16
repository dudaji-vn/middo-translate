"use client"

import { Typography } from "@/components/data-display";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function CustomError({ error }: { error: Error }) {
  const pathname = usePathname()
  const settingsPath = pathname?.replace(/\/statistics.*/, '/settings') || '/'
  return <div className='w-full px-6 bg-neutral-50 py-5'>
    <Typography className="mx-auto">{`It seems like you haven't created your extension yet. You need to create a business to see statistics.`}</Typography>
    <Link className='underline text-primary-500-main' href={settingsPath}>
      Go to settings
    </Link>
  </div>
}