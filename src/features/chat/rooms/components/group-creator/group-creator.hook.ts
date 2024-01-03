import { useCallback, useState } from 'react';

import { User } from '@/features/users/types';
import { roomApi } from '@/features/chat/rooms/api';
import { searchApi } from '@/features/search/api';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/hooks/use-search';

export const useGroupCreateSide = () => {
  const { data, setSearchTerm } = useSearch<User[]>(searchApi.users, 'group');
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

  return {
    searchResults: data,
    setSearchTerm,
    selectedUsers,
    handleSelectUser,
    handleUnSelectUser,
    mutate,
    isLoading,
  };
};
