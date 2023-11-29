import { PersistOptions, persist } from 'zustand/middleware';
import { StateCreator, create } from 'zustand';

import { User } from '@/features/users/types';

interface AuthState {
  isAuthenticated: boolean;
  user: null | User;
  logout: () => void;
  setUser: (user: User) => void;
}
type MyPersist = (
  config: StateCreator<AuthState>,
  options: PersistOptions<AuthState>,
) => StateCreator<AuthState>;

const useAuthStore = create<AuthState, []>(
  (persist as MyPersist)(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setUser(user) {
        set((state) => ({
          ...state,
          user,
          isAuthenticated: true,
        }));
      },
      logout() {
        set((state) => ({
          ...state,
          user: null,
          isAuthenticated: false,
        }));
      },
    }),
    {
      name: 'auth',
    },
  ),
);

export default useAuthStore;
