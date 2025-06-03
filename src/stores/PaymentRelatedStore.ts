import { create } from "zustand";
import { persist } from "zustand/middleware";

type PaymentRelatedStore = {
  hasPaid: boolean;
  setHasPaid: (paid: boolean) => void;

  payMethod: string | null;
  setPayMethod: (method: string) => void;

  paymentAmount: number;
  setPaymentAmount: (amount: number) => void;

  resetState: () => void;
};

export const usePaymentRelatedStore = create<PaymentRelatedStore>()(
  persist(
    (set) => ({
      hasPaid: false,
      setHasPaid: (paid) => set({ hasPaid: paid }),

      payMethod: null,
      setPayMethod: (method) => set({ payMethod: method }),

      paymentAmount: 0,
      setPaymentAmount: (amount) => set({ paymentAmount: amount }),

      resetState: () =>
        set(() => ({
          hasPaid: false,
          payMethod: null,
          paymentAmount: 0,
        })),
    }),
    {
      name: "payment-storage",
      partialize: (state) => ({
        hasPaid: state.hasPaid,
        payMethod: state.payMethod,
        paymentAmount: state.paymentAmount,
      }),
    }
  )
);
