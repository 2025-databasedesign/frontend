import { create } from "zustand";
import { persist } from "zustand/middleware";

type AdminStore = {
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;

  viewType: string;
  setViewType: (type: string) => void;
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isAdmin: false,
      setIsAdmin: (admin) => set({ isAdmin: admin }),

      viewType: "",
      setViewType: (type) => set({ viewType: type }),
    }),
    {
      name: "admin-storage",
    }
  )
);
