import { GroupCreateFooter } from './footer';
import { GroupCreateHeader } from './header';
import { GroupCreateProvider } from './context';
import { GroupCreateSearchList } from './search-list';
export interface GroupCreateSideProps {}

export const GroupCreateSide = (props: GroupCreateSideProps) => {
  return (
    <GroupCreateProvider>
      <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-card shadow-sm">
        <div className="flex flex-1 flex-col overflow-hidden">
          <GroupCreateHeader />
          <GroupCreateSearchList />
          <GroupCreateFooter />
        </div>
      </div>
    </GroupCreateProvider>
  );
};
