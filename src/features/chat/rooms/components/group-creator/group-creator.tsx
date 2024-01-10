import { GroupCreateFooter } from './group-creator-footer';
import { GroupCreateHeader } from './group-creator-header';
import { SearchList } from '../search-list';
import { SuggestionList } from '../suggestion-list';
import { useGroupCreateSide } from './group-creator.hook';
export interface GroupCreateSideProps {}

export const GroupCreateSide = (props: GroupCreateSideProps) => {
  const {
    selectedUsers,
    handleUnSelectUser,
    handleSelectUser,
    searchResults,
    isLoading,
    mutate,
    setSearchTerm,
  } = useGroupCreateSide();
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-card shadow-sm">
      <div className="flex flex-1 flex-col overflow-hidden">
        <GroupCreateHeader
          handleCreateGroup={mutate}
          setSearchTerm={setSearchTerm}
          selectedUsers={selectedUsers}
          handleUnSelectUser={handleUnSelectUser}
        />
        <SuggestionList
          searchUsers={searchResults || []}
          selectedUsers={selectedUsers}
          handleSelectUser={handleSelectUser}
        />
        <SearchList
          onItemClick={handleSelectUser}
          selectedItems={selectedUsers}
          items={searchResults || []}
        />

        <GroupCreateFooter
          selectedUsers={selectedUsers}
          createLoading={isLoading}
        />
      </div>
    </div>
  );
};
