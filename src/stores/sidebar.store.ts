import { create } from 'zustand';

export type SidebarState = {
  openSidebar: boolean;
  expand: boolean;
  setExpandSidebar: (open: boolean) => void;
  setOpenSidebar: (open: boolean, expand?: boolean) => void;
};

export const useSidebarStore = create<SidebarState>()((set) => ({
  openSidebar: false,
  expand: false,
  setOpenSidebar: (open: boolean, expand?: boolean) => {
    set(() => ({ openSidebar: open }));
    if (expand !== undefined) {
      set(() => ({ expand }));
    }
  },
  setExpandSidebar: (open: boolean) => set(() => ({ expand: open })),
}));
