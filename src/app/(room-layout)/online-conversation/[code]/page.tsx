import './style.css';

import {
  BoxChat,
  Header,
  InputEditor,
  SideChat,
} from '@/components/online-conversation/chat';

interface HomeProps {
  params: {
    code: string;
  };
}

export default async function Home(props: HomeProps) {
  return (
    <div>
      <div className="chatScreenWrapper">
        <Header />
        <div className="chatElementWrapper">
          <div className="chat">
            <BoxChat />
            <InputEditor />
          </div>
          <SideChat />
        </div>
      </div>
    </div>
  );
}
