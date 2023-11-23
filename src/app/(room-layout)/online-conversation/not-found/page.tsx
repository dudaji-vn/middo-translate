import Link from 'next/link';
import { ROUTE_NAMES } from '@/configs/route-name';

interface RoomNotFoundProps {}
export default async function RoomNotFound({}: RoomNotFoundProps) {
  return (
    <div className="myContainer">
      <div className="wrapper flex h-screen w-screen flex-col items-center justify-center px-[5vw] py-10 pt-5">
        <img src="/not-found.png" alt="not-found" width={224} />
        <h3 className="mt-8">Room not found!!!</h3>
        <p className="mt-3 text-center">
          Please check again or return to homepage to create a new room
        </p>
        <Link href={`${ROUTE_NAMES.ONLINE_CONVERSATION}`} className="mt-10">
          <button className="font-medium text-primary">
            Return to homepage
          </button>
        </Link>
      </div>
    </div>
  );
}
