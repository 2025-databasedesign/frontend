import { useNavigate } from "react-router-dom";
import "./MovieCard.css";
import { AppRoutes } from "../../routes/AppRoutes";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";

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

export default function MovieCard({ movie }: { movie: Movie }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movies/${encodeURIComponent(movie.movieName)}`);
  };

  const setSelectedMovie = useScheduleRelatedStore(
    (state) => state.setSelectedMovie
  );
  const setShouldResetMovie = useScheduleRelatedStore(
    (state) => state.setShouldResetMovie
  );
  function handleReservationClick(movieName: string) {
    setSelectedMovie(movieName);
    setShouldResetMovie(false); // prevent reset on mount
    navigate(AppRoutes.RESERVATION_PAGE);
  }

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
        예매수 {movie.rating} &nbsp;|&nbsp; ⭐{" "}
        {movie.star ?? "평점 없음"}
      </div>
      <button
        className="reserve-button"
        disabled={!movie.isReservable}
        onClick={(e) => {
          e.stopPropagation();
          if (movie.isReservable) {
            handleReservationClick(movie.movieName);
          }
        }}
      >
        {movie.isReservable ? "예매하기" : "예매 불가"}
      </button>
    </div>
  );
}
