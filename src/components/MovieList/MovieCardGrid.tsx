import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import "./MovieCardGrid.css";

type Movie = {
  movieName: string;
  rating: number;
  star: number | null;
  image: string;
  grade: string;
  isReservable: boolean;
  rank: number | null;
  releaseDate?: string; // 개봉일 추가되었을 경우 대비
};

type Props = {
  sortType: string;
  onlyNowPlaying: boolean;
};

export default function MovieCardGrid({ sortType, onlyNowPlaying }: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetch("/src/assets/cinema_info/mock_cinema.json")
      .then((res) => res.json())
      .then((data) => setMovies(data));
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
