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
    fetch("http://54.180.117.246/api/movies")
      .then((res) => res.json())
      .then((result) => {
        if (result?.result && Array.isArray(result.data)) {
          const mapped = result.data.map((item: any) => ({
            movieId: item.movieId,
            movieName: item.title,
            rating: item.rating ?? 0,
            star: item.star ?? null,
            image: item.posterPath
              ? `http://54.180.117.246${item.posterPath.replace(/^\/images\/posters\//, "/Images/")}`
              : "",
            grade: item.grade === "15"
              ? "/src/assets/grade_15.png"
              : item.grade === "19"
              ? "/src/assets/grade_19.png"
              : "/src/assets/grade_all.png",
            isReservable: true, // 실제 예약 가능 여부는 별도 필드가 있으면 사용
            rank: item.rank ?? null,
            releaseDate: item.releaseDate,
            runningTime: item.runningTime,
            director: item.director,
            actors: item.actors,
            formats: item.formats,
            genreIds: item.genreIds,
            genreNames: item.genreNames,
          }));
          setMovies(mapped);
        }
      });
  }, []);

  const filtered = onlyNowPlaying
    ? movies.filter((m) => m.isReservable)
    : movies;

  const sortedMovies = [...filtered].sort((a, b) => {
    switch (sortType) {
      case "예매율순":
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
