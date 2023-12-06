import { create } from 'zustand';

export type AuthState = {
  isAuthentication: boolean;
  isLoaded: boolean;
  user: any;
  loading: boolean;
  setData: (data: any) => void;
};


export const useAuthStore = create<AuthState>()((set) => ({
  isAuthentication: false,
  auth: null,
  isLoaded: false,
  loading: false,
  user: null,
  setData: (data: any) => set(() => ({ ...data }))
}));



// import { StateCreator, create } from 'zustand';
// import { PersistOptions, persist } from 'zustand/middleware';

// export type AuthState = {
//   isAuthentication: boolean;
//   isLoaded: boolean;
//   user: any;
//   loading: boolean;
//   setData: (data: any) => void;
// };
// type MyPersist = (
//   config: StateCreator<AuthState>,
//   options: PersistOptions<AuthState>,
// ) => StateCreator<AuthState>;

// export const useAuthStore = create<AuthState, []>(
//   (persist as MyPersist)(
//     (set) => ({
//       isAuthentication: false,
//       isLoaded: false,
//       loading: false,
//       user: null,
//       setData: (data: any) => set(() => ({ ...data }))
//     }),
//     {
//       name: 'authStore',
//     },
//   ),
// );