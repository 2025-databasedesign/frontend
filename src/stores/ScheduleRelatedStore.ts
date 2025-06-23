import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PeopleCount = {
  adult: number;
  teen: number;
  senior: number;
  kid: number;
  disabled: number;
};

type ScheduleRelatedStore = {
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  selectedTheater: string | null;
  setSelectedTheater: (theater: string | null) => void;

  selectedScreenId: number | null;
  setSelectedScreenId: (id: number | null) => void;

  selectedMovie: string | null;
  setSelectedMovie: (movie: string | null) => void;

  shouldResetMovie: boolean;
  setShouldResetMovie: (reset: boolean) => void;

  selectedGrade: string | null;
  setSelectedGrade: (grade: string) => void;

  selectedFormat: string | null;
  setSelectedFormat: (format: string) => void;

  selectedScreenTime: [string, string] | null;
  setSelectedScreenTime: (screenTime: [string, string] | null) => void;

  selectedPeople: PeopleCount;
  setSelectedPeople: (people: PeopleCount) => void;

  selectedSeats: number[][];
  setSelectedSeats: (seats: number[][]) => void;

  reservationTime: string | null;
  setReservationTime: (time: string) => void;

  resetState: () => void;
};

export const useScheduleRelatedStore = create<ScheduleRelatedStore>()(
  persist(
    (set) => ({
      selectedDate: "2025-06-11", //temporary date for ui
      setSelectedDate: (date) => set({ selectedDate: date }),

      selectedTheater: null,
      setSelectedTheater: (theater) => set({ selectedTheater: theater }),

      selectedScreenId: null,
      setSelectedScreenId: (id) => set({ selectedScreenId: id }),

      selectedMovie: null,
      setSelectedMovie: (movie) => set({ selectedMovie: movie }),

      shouldResetMovie: true,
      setShouldResetMovie: (reset) => set({ shouldResetMovie: reset }),

      selectedGrade: null,
      setSelectedGrade: (grade) => set({ selectedGrade: grade }),

      selectedFormat: null,
      setSelectedFormat: (format) => set({ selectedFormat: format }),

      selectedScreenTime: null,
      setSelectedScreenTime: (screenTime) =>
        set({ selectedScreenTime: screenTime }),

      selectedPeople: {
        adult: 0,
        teen: 0,
        senior: 0,
        kid: 0,
        disabled: 0,
      },
      setSelectedPeople: (people) => set({ selectedPeople: people }),

      selectedSeats: [],
      setSelectedSeats: (seats) => set({ selectedSeats: seats }),

      reservationTime: null,
      setReservationTime: (time) => set({ reservationTime: time }),


      resetState: () =>
        set(() => ({
          selectedDate: "2025-06-11",
          selectedTheater: null,
          selectedMovie: null,
          shouldResetMovie: true,
          selectedGrade: null,
          selectedFormat: null,
          selectedScreenTime: null,
          selectedPeople: {
            adult: 0,
            teen: 0,
            senior: 0,
            kid: 0,
            disabled: 0,
          },
          selectedSeats: [],
        })),
    }),
    {
      name: "schedule-storage",
      partialize: (state) => ({
        selectedDate: state.selectedDate,
        selectedTheater: state.selectedTheater,
        selectedMovie: state.selectedMovie,
        selectedGrade: state.selectedGrade,
        selectedFormat: state.selectedFormat,
        selectedScreenTime: state.selectedScreenTime,
        selectedPeople: state.selectedPeople,
        selectedSeats: state.selectedSeats,
      }),
    }
  )
);
