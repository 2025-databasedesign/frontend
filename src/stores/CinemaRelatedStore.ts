import { create } from "zustand";
import { persist } from "zustand/middleware";

type MovieInfo = {
  movieId: number;
  title: string;
  runningTime: number;
  releaseDate: string;
  director: string;
  actor: string[];
  grade: string;
  formats: string[];
  genreIds: number[];
  genreNames: string[];
};

type Seat = {
  seatId: number;
  seatNumber: string;
  rowNo: number;
  colNo: number;
  status: string;
  theater: string;
};

type TheaterInfo = {
  theaterId: number;
  theaterName: string;
  totalSeats: number;
  screenType: string;
  seats: Seat[] | null;
};

type CinemaRelatedStore = {
  scheduleViewType: string;
  setScheduleViewType: (viewType: string) => void;

  movieList: MovieInfo[];
  setMovieList: (list: MovieInfo[]) => void;

  theaterList: TheaterInfo[];
  setTheaterList: (list: TheaterInfo[]) => void;

};

export const useCinemaRelatedStore = create<CinemaRelatedStore>()(
  persist(
    (set) => ({
      scheduleViewType: "movie",
      setScheduleViewType: (viewType) => set({ scheduleViewType: viewType }),

      movieList: [],
      setMovieList: (list) => set({ movieList: list }),

      theaterList: [],
      setTheaterList: (list) => set({ theaterList: list }),

    }),
    {
      name: "cinema-storage",
      partialize: (state) => ({
        movieList: state.movieList,
        theaterList: state.theaterList,
      }),
    }
  )
);
