import './style.css';

import {
  RoomJoinerProvider,
  RoomJoinerSubmit,
  SelectNativeLanguage,
  UsernameInput,
} from '@/components/online-conversation/join';

import Image from 'next/image';
import { ROUTE_NAMES } from '@/configs/route-name';
import { getConversation } from '@/services/conversation';
import { redirect } from 'next/navigation';

interface JoinProps {
  params: {
    code: string;
  };
}

export const dynamic = 'force-dynamic';
export default async function Join(props: JoinProps) {
  const room = await getConversation(props.params.code);
  if (!room) {
    redirect(ROUTE_NAMES.ONLINE_CONVERSATION);
  }
  return (
    <RoomJoinerProvider room={room}>
      <div className="myContainer">
        <div className="wrapper join">
          <div className="columnWrapper">
            <div className="rightColumn join">
              <div className="introImg">
                <Image
                  src="/conversation_intro.png"
                  width={1000}
                  height={1000}
                  alt=""
                />
              </div>
            </div>
            <div className="leftColumn">
              <div className="conversationForm">
                <FormTitle>Join conversation</FormTitle>
                <div className="formSection mb-0">
                  <FormField label="Name">
                    <UsernameInput />
                  </FormField>
                  <FormField label="Language">
                    <SelectNativeLanguage />
                  </FormField>
                </div>
                <RoomJoinerSubmit />
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoomJoinerProvider>
  );
}

const FormTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="CPtitle">
      <div
        style={{
          width: '4px',
          height: '24px',
          borderRadius: '99px',
        }}
        className="bg-primary"
      ></div>
      <h4>{children}</h4>
    </div>
  );
};

const FormField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="formField">
      <label className="label" htmlFor="Name">
        {label}
      </label>
      {children}
    </div>
  );
};
