import React from "react";
import { useNavigate } from "react-router-dom";
import "./MovieCard.css";

type Movie = {
  movieName: string;
  rating: number;
  star: number | null;
  image: string;
  grade: string;
  isReservable: boolean;
  rank: number | null;
};

export default function MovieCard({ movie }: { movie: Movie }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movies/${encodeURIComponent(movie.movieName)}`);
  };

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="card-header">
        <span className="movie-rank">
          {movie.rank ? `No.${movie.rank}` : "순위 없음"}
        </span>
        <img src={movie.grade} alt="등급" className="card-grade" />
      </div>
      <img src={movie.image} alt={movie.movieName} className="movie-poster" />
      <div className="movie-title">{movie.movieName}</div>
      <div className="movie-info">
        예매율 {movie.rating.toFixed(1)}% &nbsp;|&nbsp;
        ⭐ {movie.star ?? "평점 없음"}
      </div>
      <button
        className="reserve-button"
        disabled={!movie.isReservable}
        onClick={(e) => e.stopPropagation()}
      >
        {movie.isReservable ? "예매하기" : "예매 불가"}
      </button>
    </div>
  );
}
