import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PeopleCount } from "./ScheduleRelatedStore";

export type ReservationType = {
  id: string;
  date: string;
  theater: string | null;
  movie: string | null;
  grade: string | null;
  format: string | null;
  screenTime: [string, string] | null;
  selectedPeople: PeopleCount;
  seats: number[][];
  payMethod: string | null;
  paymentAmount: number;
};

type CancelType = {
  id: string;
  date: string;
  theater: string | null;
  movie: string | null;
  grade: string | null;
  format: string | null;
  screenTime: [string, string] | null;
  selectedPeople: PeopleCount;
  seats: number[][];
  cancelDate: string;
  cancelPayMethod: string | null;
  cancelPayAmount: number;
};

type ReservationHistoryStore = {
  reservationHistory: ReservationType[];
  addReservation: (reservation: ReservationType) => void;
  deleteReservation: (id: string) => void;
  clearReservations: () => void; // optional: for reset

  cancelHistory: CancelType[];
  addCancelHistory: (cancel: CancelType) => void;
  deleteCancelHistory: (id: string) => void;
};

export const useReservationHistoryStore = create<ReservationHistoryStore>()(
  persist(
    (set) => ({
      reservationHistory: [],
      addReservation: (reservation) =>
        set((state) => ({
          reservationHistory: [...state.reservationHistory, reservation],
        })),
      deleteReservation: (id) =>
        set((state) => ({
          reservationHistory: state.reservationHistory.filter(
            (r) => r.id !== id
          ),
        })),
      clearReservations: () => set({ reservationHistory: [] }),

      cancelHistory: [],
      addCancelHistory: (cancel) =>
        set((state) => ({
          cancelHistory: [...state.cancelHistory, cancel],
        })),
      deleteCancelHistory: (id) =>
        set((state) => ({
          cancelHistory: state.cancelHistory.filter((r) => r.id !== id),
        })),
    }),
    {
      name: "history-storage",
    }
  )
);
