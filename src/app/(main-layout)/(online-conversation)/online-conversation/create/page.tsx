import './style.css';

import { RoomCreatorProvider } from '@/components/online-conversation/room-creator-context';
import { RoomCreatorSubmit } from '@/components/online-conversation/room-creator-submit';
import { SelectLanguages } from '@/components/online-conversation/select-languages';
import { SelectNativeLanguage } from '@/components/online-conversation/select-native-language';
import { UsernameInput } from '@/components/online-conversation/username-input';

interface CreateProps {}

export default async function Create(props: CreateProps) {
  return (
    <div className="myContainer">
      <div className="wrapper create">
        <div className="columnWrapper">
          <div className="rightColumn create">
            <img className="introImg" src="/conversation_intro.png" alt="" />
          </div>
          <div className="leftColumn">
            <RoomCreatorProvider>
              <div className="conversationForm">
                <FormTitle>Create conversation</FormTitle>
                <div className="formSection">
                  <SelectLanguages />
                </div>
                <div className="formSection mb-0">
                  <FormField label="Your name">
                    <UsernameInput />
                  </FormField>
                  <FormField label="Your language">
                    <SelectNativeLanguage />
                  </FormField>
                </div>
                <RoomCreatorSubmit />
              </div>
            </RoomCreatorProvider>
          </div>
        </div>
      </div>
    </div>
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
