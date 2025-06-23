import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  name: string;
  setName: (nickname: string) => void;
  userEmail: string;
  setUserEmail: (nickname: string) => void;

  userStatus: string;
  setUserStatus: (status: string) => void;

  balance: number;
  setBalance: (balance: number) => void;
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

      balance: 0,
      setBalance: (balance) => set({ balance }),
    }),
    {
      name: "user-storage",
    }
  )
);
