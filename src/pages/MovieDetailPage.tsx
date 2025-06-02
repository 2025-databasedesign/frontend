import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./MovieDetailPage.css";
import { useScheduleRelatedStore } from "../stores/ScheduleRelatedStore";
import { AppRoutes } from "../routes/AppRoutes";

type Movie = {
  movieName: string;
  rating: number;
  star: number | null;
  image: string;
  grade: string;
  isReservable: boolean;
  rank: number | null;
  releaseDate?: string;
};

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const navigate = useNavigate();
  const setSelectedMovie = useScheduleRelatedStore(
    (state) => state.setSelectedMovie
  );
  const setShouldResetMovie = useScheduleRelatedStore(
    (state) => state.setShouldResetMovie
  );

  useEffect(() => {
    fetch("/src/assets/cinema_info/mock_cinema.json")
      .then((res) => res.json())
      .then((data: Movie[]) => {
        const matched = data.find((m) => m.movieName === movieId);
        setMovie(matched ?? null);
      });
  }, [movieId]);

  function handleReservationClick(movieName: string) {
    setSelectedMovie(movieName);
    setShouldResetMovie(false); // prevent reset on mount
    navigate(AppRoutes.RESERVATION_PAGE);
  }

  if (!movie) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        영화를 찾을 수 없습니다.
      </div>
    );
  }

  const parseGradeNumber = (gradePath: string) => {
    const match = gradePath.match(/grade_(\d+)\.png$/);
    return match ? match[1] : "등급 정보 없음";
  };

  return (
    <div>
      <div className="navbar-wrapper">
        <Navbar />
      </div>

      <div className="movie-detail-page">
        <div className="movie-detail-header">
          <img src={movie.image} alt="poster" className="movie-poster" />
          <div className="movie-info-section">
            <div className="movie-title">{movie.movieName}</div>
            <div className="movie-badges">
              <span className="badge">
                {parseGradeNumber(movie.grade)}세 관람가
              </span>
              {movie.isReservable ? (
                <span className="badge">예매중</span>
              ) : (
                <span className="badge">예매 불가</span>
              )}
            </div>
            <div className="movie-metrics">
              예매율 {movie.rating.toFixed(1)}% | ⭐ {movie.star ?? "평점 없음"}
            </div>
            <div className="movie-details">
              감독: 감독 이름 / 배우: 배우1, 배우2
              <br />
              장르: 액션 / 개봉: {movie.releaseDate ?? "정보 없음"}
            </div>
            <div className="detail-buttons">
              <button className="reserve" disabled={!movie.isReservable} onClick={() => handleReservationClick(movie.movieName)}>
                예매하기
              </button>
            </div>
          </div>
        </div>

        <div className="review-section">
          <div className="review-form">
            <textarea placeholder="리뷰를 입력하세요..." />
            <button>리뷰 등록</button>
          </div>
          <div className="review-list">
            <div className="review-item">
              <strong>리뷰1:</strong> 하하
            </div>
            <div className="review-item">
              <strong>리뷰2:</strong> 리리리...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
