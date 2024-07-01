import { create } from 'zustand';

export type SidebarState = {
  openSidebar: boolean;
  expand: boolean;
  openNavigator: boolean;
  setOpenNavigator: (open: boolean) => void;
  setExpandSidebar: (open: boolean) => void;
  setOpenSidebar: (open: boolean, expand?: boolean) => void;
};

export const useSidebarStore = create<SidebarState>()((set) => ({
  openSidebar: false,
  expand: false,
  openNavigator: false,
  setOpenNavigator: (open: boolean) => {
    set(() => ({ openNavigator: open }));
    if (!open) set(() => ({ expand: false }));
  },
  setOpenSidebar: (open: boolean, expand?: boolean) => {
    set(() => ({ openSidebar: open }));
    if (expand !== undefined) {
      set(() => ({ expand }));
    }
    if (!expand) set(() => ({ openNavigator: false }));
  },
  setExpandSidebar: (open: boolean) => set(() => ({ expand: open })),
}));
