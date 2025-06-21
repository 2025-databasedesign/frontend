import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  name: string;
  setName: (nickname: string) => void;
  userEmail: string;
  setUserEmail: (nickname: string) => void;

  userStatus: string;
  setUserStatus: (status: string) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      name: "",
      setName: (nickname) => set({ name: nickname }),

      userEmail: "",
      setUserEmail: (mail) => set({ userEmail: mail }),

      userStatus: "",
      setUserStatus: (status) => set({userStatus: status}),
    }),
    {
      name: "user-storage",
    }
  )
);
