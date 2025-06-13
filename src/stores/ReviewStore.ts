import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MovieReviewType = {
  movieReviewId: string;
  movieStar: number;
  movieName: string;
  movieReviewTime: string;
  movieReviewContent: string | null;
};

type TheaterReviewType = {
  theaterReviewId: string;
  theaterStar: number;
  theaterName: string;
  theaterReviewTime: string;
  theaterReviewContent: string;
};

type ReviewStore = {
  movieReviewList: MovieReviewType[];
  addMovieReview: (review: MovieReviewType) => void;
  deleteMovieReview: (id: string) => void;

  theaterReviewList: TheaterReviewType[];
  addTheaterReview: (review: TheaterReviewType) => void;
  deleteTheaterReview: (id: string) => void;
};

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set) => ({
      movieReviewList: [],
      addMovieReview: (review) =>
        set((state) => ({
          movieReviewList: [...state.movieReviewList, review],
        })),
      deleteMovieReview: (id) =>
        set((state) => ({
          movieReviewList: state.movieReviewList.filter(
            (r) => r.movieReviewId !== id
          ),
        })),

      theaterReviewList: [],
      addTheaterReview: (review) =>
        set((state) => ({
          theaterReviewList: [...state.theaterReviewList, review],
        })),
      deleteTheaterReview: (id) =>
        set((state) => ({
          theaterReviewList: state.theaterReviewList.filter(
            (r) => r.theaterReviewId !== id
          ),
        })),
    }),
    {
      name: "review-storage",
    }
  )
);
