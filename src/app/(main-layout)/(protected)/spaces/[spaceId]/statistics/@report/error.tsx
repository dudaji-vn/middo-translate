"use client"


export enum EStatisticErrors {
  NO_ANALYSTIC_DATA = "NO_ANALYSTIC_DATA",
  NEXT_NOT_FOUND = "NEXT_NOT_FOUND"
}
export default function CustomError({ error }: { error: Error }) {

  console.error('Statistic error', error);
  if (error.message == EStatisticErrors.NO_ANALYSTIC_DATA)
    return <div className='w-full px-6 bg-neutral-50 py-5'>
      <p className='w-full text-center'>No analystic data found</p>
    </div>

  console.error('Statistic error', error);
  return <div className='w-full px-6 bg-neutral-50 py-5'>
    <p className='w-full text-center'>An error occurred.</p>
  </div>

}