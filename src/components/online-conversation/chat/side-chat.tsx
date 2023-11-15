import { ArrowBackOutline, CopyOutline, Share } from '@easy-eva-icons/react';

export interface SideChatProps {}

export const SideChat = (props: SideChatProps) => {
  return (
    <div className="chatInfo">
      <div className="row1">
        <a href="#" className="inputChatButton backArrow">
          <ArrowBackOutline className="h-7 w-7 rotate-180" />
        </a>
        <p>Conversation room code:</p>
        <div className="codeWrapper">
          <h1>ABHYU</h1>
          <a href="#" className="iconNoBGbutton">
            <CopyOutline className="h-7 w-7 opacity-60" />
          </a>
        </div>
        <div className="qrWrapper">
          <img src="/qr_generator.png" alt="" />
        </div>
        <div className="circleButtonWrapper">
          <div className="circleButton">
            <Share className="h-7 w-7 text-primary" />
          </div>
          Share through link
        </div>
        <a
          className="leaveRoomButton"
          href="http://localhost:3000/first-screen"
        >
          Leave Room
        </a>
      </div>
      <div className="row2">
        <div className="appInfo">
          <p>Powered by</p>
          <img src="/logo.png" alt="" />
        </div>
      </div>
    </div>
  );
};
