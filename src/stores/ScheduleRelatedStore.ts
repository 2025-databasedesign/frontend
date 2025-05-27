import { create } from "zustand";
import { persist } from "zustand/middleware";

type PeopleCount = {
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
  scheduleViewType: string;
  setScheduleViewType: (viewType: string) => void;
  selectedMovie: string | null;
  setSelectedMovie: (movie: string | null) => void;
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
};

export const useScheduleRelatedStore = create<ScheduleRelatedStore>()(
  persist(
    (set) => ({
      selectedDate: "2025-05-17", //temporary date for ui
      setSelectedDate: (date) => set({ selectedDate: date }),
      selectedTheater: null,
      setSelectedTheater: (theater) => set({ selectedTheater: theater }),
      scheduleViewType: "theater",
      setScheduleViewType: (viewType) => set({ scheduleViewType: viewType }),
      selectedMovie: null,
      setSelectedMovie: (movie) => set({ selectedMovie: movie }),
      selectedScreenTime: null,
      setSelectedGrade: (grade) => set({ selectedGrade: grade }),
      selectedFormat: null,
      setSelectedFormat: (format) => set({ selectedFormat: format }),
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
      selectedGrade: null,
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
