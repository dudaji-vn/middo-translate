import Link from 'next/link';
import { ROUTE_NAMES } from '@/configs/route-name';
import { RoomCodeInput } from '@/components/online-conversation/join';

interface HomeProps {
  params: {
    code: string;
  };
}

export default async function Home(props: HomeProps) {
  return (
    <div>
      <div className="myContainer">
        <div className="wrapper">
          <div className="columnWrapper">
            <div className="rightColumn">
              <img className="introImg" src="/conversation_intro.png" alt="" />
            </div>
            <div className="leftColumn">
              <div className="introTxt">
                <h2>Online Conversation</h2>
                <p>
                  Generate a unique access code to create and join chat rooms
                  easily. Perfect for secure and swift online conversations.
                </p>
              </div>
              <RoomCodeInput />
              <div className="lineWrapper">
                <div
                  style={{ width: '70%', height: '1px' }}
                  className="bg-stroke"
                ></div>
              </div>
              <Link
                href={ROUTE_NAMES.ONLINE_CONVERSATION_CREATE}
                className="strokeButton"
              >
                Create your own room
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
