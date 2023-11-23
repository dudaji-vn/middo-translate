import './style.css';

import Image from 'next/image';
import Link from 'next/link';
import { Plus } from '@easy-eva-icons/react';
import { ROUTE_NAMES } from '@/configs/route-name';
import { RoomCodeInput } from '@/components/online-conversation/join';

interface HomeProps {}

export default async function Home(props: HomeProps) {
  return (
    <div>
      <div className="myContainer">
        <div className="wrapper">
          <div className="columnWrapper">
            <div className="rightColumn ">
              <div className="introImg">
                <Image
                  src="/conversation_intro.png"
                  width={1000}
                  height={1000}
                  alt=""
                />
              </div>
            </div>
            <div className="leftColumn my-auto">
              <div className="introTxt">
                <h2>Online Conversation</h2>
                <p>
                  Generate a unique access code to create and join chat rooms
                  easily. Perfect for secure and swift online conversations.
                </p>
              </div>
              <div className="mb-8 rounded-full border border-primary p-3">
                <RoomCodeInput />
              </div>

              <Link
                href={ROUTE_NAMES.ONLINE_CONVERSATION_CREATE}
                className="fillButton !py-4 md:!py-3"
              >
                <Plus className="mr-2 h-5 w-5 text-background" /> Create room
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
