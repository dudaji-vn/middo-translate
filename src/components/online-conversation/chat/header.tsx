export interface HeaderProps {}

export const Header = (props: HeaderProps) => {
  return (
    <div className="chatNavigation">
      <div>
        Sun room
        <a href="#" className="moreChatButton">
          <img src="/more.png" alt="" />
        </a>
      </div>
    </div>
  );
};
