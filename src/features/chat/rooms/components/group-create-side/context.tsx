'use client';

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { UseMutateFunction, useMutation } from '@tanstack/react-query';

import { Room } from '@/features/chat/rooms/types';
import { User } from '@/features/users/types';
import { roomApi } from '../../api';
import { searchApi } from '@/features/search/api';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/hooks/use-search';

type GroupCreateContext = {
  searchUsers: User[];
  selectedUsers: User[];
  handleSelectUser: (user: User) => void;
  setSearchTerm: (term: string) => void;
  handleUnSelectUser: (user: User) => void;
  handleCreateGroup: UseMutateFunction<
    Room,
    unknown,
    Pick<Room, 'name' | 'avatar'> & {
      participants: string[];
      avatarFile?: File | undefined;
    },
    unknown
  >;
  createLoading?: boolean;
};

export const GroupCreateContext = createContext<GroupCreateContext>({
  searchUsers: [],
  selectedUsers: [],
  setSearchTerm: () => {},
  handleSelectUser: () => {},
  handleUnSelectUser: () => {},
  handleCreateGroup: () => Promise.resolve({} as Room),
  createLoading: false,
});

export const useGroupCreate = () => {
  return useContext(GroupCreateContext);
};
interface GroupCreateProviderProps extends PropsWithChildren {}
export const GroupCreateProvider = ({ children }: GroupCreateProviderProps) => {
  const { data, setSearchTerm } = useSearch<User[]>(searchApi.users);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const router = useRouter();

  const handleSelectUser = useCallback((user: User) => {
    setSelectedUsers((prev) => {
      let newSelectedUsers = [];
      const index = prev.findIndex((u) => u._id === user._id);
      if (index === -1) {
        newSelectedUsers = [...prev, user];
      } else {
        newSelectedUsers = [...prev.slice(0, index), ...prev.slice(index + 1)];
      }

      return newSelectedUsers;
    });
  }, []);

  const handleUnSelectUser = useCallback((user: User) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== user._id));
  }, []);

  const { mutate, isLoading } = useMutation({
    mutationFn: roomApi.createRoom,
    onSuccess: (data) => {
      router.push(`/talk/${data._id}`);
    },
  });

  return (
    <GroupCreateContext.Provider
      value={{
        searchUsers: data || [],
        selectedUsers,
        handleSelectUser,
        setSearchTerm,
        handleUnSelectUser,
        handleCreateGroup: mutate,
        createLoading: isLoading,
      }}
    >
      {children}
    </GroupCreateContext.Provider>
  );
};
