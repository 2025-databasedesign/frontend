import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import "./MovieCardGrid.css";

// type Movie = {
//   movieName: string;
//   rating: number;
//   star: number | null;
//   image: string;
//   grade: string;
//   isReservable: boolean;
//   rank: number | null;
//   releaseDate?: string;
// };

type Movie = {
  movieId: number;
  movieName: string;
  rating: number;
  star: number | null;
  image: string;
  grade: string;
  isReservable: boolean;
  rank: number | null;
  releaseDate?: string;
  runningTime?: number;
  director?: string;
  actors?: string[];
  formats?: string[];
  genreIds?: number[];
  genreNames?: string[];
};

type Props = {
  sortType: string;
  onlyNowPlaying: boolean;
};

export default function MovieCardGrid({ sortType, onlyNowPlaying }: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://54.180.117.246/api/movies");
        if (!response.ok) {
          throw new Error("Failed to fetch movies info");
        }
        const result = await response.json();
        if (result?.result && Array.isArray(result.data)) {
          // Fetch revenue data for all movies
          let revenueMap: Record<string, number> = {};
          try {
            const revenueRes = await fetch(
              "http://54.180.117.246/api/revenue/movie"
            );
            if (revenueRes.ok) {
              const revenueData = await revenueRes.json();
              if (revenueData?.result && typeof revenueData.data === "object") {
                revenueMap = revenueData.data;
              }
            }
          } catch (e) {
            // ignore revenue fetch error
          }

          const mapped = await Promise.all(
            result.data.map(async (item: any) => {
              let star: number | null = null;
              let rating: number = 0;
              try {
                const reviewRes = await fetch(
                  `http://54.180.117.246/api/reviews?type=MOVIE&targetId=${item.movieId}`
                );
                if (reviewRes.ok) {
                  const reviewData = await reviewRes.json();
                  if (
                    Array.isArray(reviewData.data) &&
                    reviewData.data.length > 0
                  ) {
                    const ratings = reviewData.data.map((r: any) => r.rating);
                    const avg =
                      ratings.reduce(
                        (sum: number, cur: number) => sum + cur,
                        0
                      ) / ratings.length;
                    star = avg;
                  }
                }
              } catch (e) {
                // ignore error, star remains null
              }

              // 예매수 계산: 영화명 일치하는 revenue 값 / 15000, 올림
              let ticketCount = 0;
              if (item.title && revenueMap[item.title] != null) {
                ticketCount = Math.ceil(revenueMap[item.title] / 15000);
              }

              return {
                movieId: item.movieId,
                movieName: item.title,
                rating: ticketCount,
                star,
                image: item.posterPath
                  ? `http://54.180.117.246${item.posterPath.replace(
                      /^\/images\/posters\//,
                      "/Images/"
                    )}`
                  : "",
                grade:
                  item.grade === "15"
                    ? "/src/assets/grade_15.png"
                    : item.grade === "19"
                    ? "/src/assets/grade_19.png"
                    : "/src/assets/grade_all.png",
                isReservable: true,
                rank: item.rank ?? null,
                releaseDate: item.releaseDate,
                runningTime: item.runningTime,
                director: item.director,
                actors: item.actors,
                formats: item.formats,
                genreIds: item.genreIds,
                genreNames: item.genreNames,
              };
            })
          );
          setMovies(mapped);
        }
      } catch (error) {
        console.log("error: ", error);
      }
    };
    fetchMovies();
  }, []);

  const filtered = onlyNowPlaying
    ? movies.filter((m) => m.isReservable)
    : movies;

  const sortedMovies = [...filtered].sort((a, b) => {
    switch (sortType) {
      case "예매순":
        return b.rating - a.rating;
      case "별점순":
        return (b.star ?? 0) - (a.star ?? 0);
      case "개봉일순":
        return (
          new Date(b.releaseDate ?? "1900-01-01").getTime() -
          new Date(a.releaseDate ?? "1900-01-01").getTime()
        );
      default:
        return 0;
    }
  });

  return (
    <div className="movie-card-grid">
      {sortedMovies.map((movie, index) => (
        <MovieCard key={index} movie={movie} />
      ))}
    </div>
  );
}
