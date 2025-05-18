import { create } from "zustand";

type ScheduleRelatedStore = {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTheater: string | null;
  setSelectedTheater: (theater: string | null) => void;
  scheduleViewType: string;
  setScheduleViewType: (viewType: string) => void;
  selectedMovie: string | null;
  setSelectedMovie: (movie: string | null) => void;
};

export const useScheduleRelatedStore = create<ScheduleRelatedStore>((set) => ({
  selectedDate: "2025-05-17", //temporary date for ui
  setSelectedDate: (date) => set({ selectedDate: date }),
  selectedTheater: null,
  setSelectedTheater: (theater) => set({ selectedTheater: theater }),
  scheduleViewType: "theater",
  setScheduleViewType: (viewType) => set({ scheduleViewType: viewType }),
  selectedMovie: null,
  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
}));
