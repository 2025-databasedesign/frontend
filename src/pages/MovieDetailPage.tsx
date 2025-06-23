import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./MovieDetailPage.css";
import { useScheduleRelatedStore } from "../stores/ScheduleRelatedStore";
import { AppRoutes } from "../routes/AppRoutes";
import { useReviewStore } from "../stores/ReviewStore";
import { useReservationHistoryStore } from "../stores/ReservationHistoryStore";

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

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [textCount, setTextCount] = useState(0);
  const navigate = useNavigate();
  // ------------------------- Access store
  const selectedMovie = useScheduleRelatedStore((state) => state.selectedMovie);
  const setSelectedMovie = useScheduleRelatedStore(
    (state) => state.setSelectedMovie
  );
  const setShouldResetMovie = useScheduleRelatedStore(
    (state) => state.setShouldResetMovie
  );
  const reservationHistory = useReservationHistoryStore(
    (state) => state.reservationHistory
  );
  const movieReviewList = useReviewStore((state) => state.movieReviewList);
  const addMovieReview = useReviewStore((state) => state.addMovieReview);

  // ------------------------- Access store

  const textarea = document.getElementById(
    "textAreaReview"
  ) as HTMLTextAreaElement;
  const charCount = document.getElementById("charCount") as HTMLDivElement;
  const maxLength = 100;
  const filteredHistory = reservationHistory.filter(
    (m) => m.movie == movie?.movieName
  );

  const reviewInfo = movieReviewList.filter(
    (r) => r.movieName === movie?.movieName
  );

  const reviewable =
    filteredHistory.length > 0 && reviewInfo.length < filteredHistory.length;

  const parseGradeNumber = (gradePath: string) => {
    const match = gradePath.match(/grade_(\d+)\.png$/);
    return match ? match[1] : "등급 정보 없음";
  };

  function charCounter(inputField: string) {
    const currentLength = inputField.length;
    setTextCount(currentLength);

    if (currentLength >= maxLength) {
      charCount.classList.add("limit-exceeded");
    } else {
      charCount.classList.remove("limit-exceeded");
    }
  }

  function handleReservationClick(movieName: string) {
    setSelectedMovie(movieName);
    setShouldResetMovie(false); // prevent reset on mount
    navigate(AppRoutes.RESERVATION_PAGE);
  }

  function handleReview() {
    const dateTime = new Date().toISOString();

    if (movie) {
      const newReview = {
        movieReviewId: dateTime + selectedMovie,
        movieStar: 1,
        movieName: movie?.movieName,
        movieReviewTime: dateTime,
        movieReviewContent: textarea.value,
      };
      addMovieReview(newReview);
      textarea.value = "";
      charCount.textContent = `0 / 100`;
    }
  }

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
            isReservable: true,
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

  useEffect(() => {
    if (movies.length && movieId) {
      const matched = movies.find((m) => m.movieName === movieId);
      setMovie(matched ?? null);
    }
  }, [movies, movieId]);

  if (!movie) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        영화를 찾을 수 없습니다.
      </div>
    );
  }

  console.log("movie: ", movie);

  // useEffect(() => {
  //   fetch("/src/assets/cinema_info/mock_cinema.json")
  //     .then((res) => res.json())
  //     .then((data: Movie[]) => {
  //       const matched = data.find((m) => m.movieName === movieId);
  //       setMovie(matched ?? null);
  //     });
  // }, [movieId]);

  // if (!movie) {
  //   return (
  //     <div style={{ padding: "40px", textAlign: "center" }}>
  //       영화를 찾을 수 없습니다.
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="navbar-wrapper">
        <Navbar />
      </div>

      <div className="movie-detail-page">
        <div className="movie-detail-header">
          <img src={movie.image} alt="poster" className="detail-movie-poster" />
          <div className="movie-info-section">
            <div className="movie-title">{movie.movieName}</div>
            <div className="movie-badges">
              <span className="badge">
                {parseGradeNumber(movie.grade)}세 관람가
              </span>
              {movie.isReservable ? (
                <span className="badge">예매 가능</span>
              ) : (
                <span className="badge">예매 불가</span>
              )}
            </div>
            <div className="movie-metrics">
              예매율 {movie.rating.toFixed(1)}% | ⭐ {movie.star ?? "평점 없음"}
            </div>
            <div className="movie-details">
              감독: {movie.director ?? "정보 없음"} / 배우: {movie.actors && movie.actors.length > 0 ? movie.actors.join(", ") : "정보 없음"}
              <br />
              장르: {movie.genreNames && movie.genreNames.length > 0 ? movie.genreNames.join(", ") : "정보 없음"} / 개봉: {movie.releaseDate ?? "정보 없음"}
            </div>
            <div className="detail-buttons">
              <button
                className="reserve"
                disabled={!movie.isReservable}
                onClick={() => handleReservationClick(movie.movieName)}
              >
                예매하기
              </button>
            </div>
          </div>
        </div>

        <div className="review-section">
          {reviewable ? (
            <div className="review-form">
              <textarea
                id="textAreaReview"
                name="textAreaReview"
                placeholder="리뷰를 입력하세요..."
                maxLength={maxLength}
                onInput={() => {
                  if (textarea) {
                    charCounter(textarea.value);
                  } else {
                    setTextCount(3);
                  }
                }}
              />
              <p id="charCount" className="character-limit">
                {textCount} / {maxLength}
              </p>
              <button
                onClick={() => {
                  if (textarea && textarea.value) {
                    handleReview();
                  }
                }}
              >
                리뷰 등록
              </button>
            </div>
          ) : (
            <></>
          )}
          {reviewInfo.length >= 0 ? (
            <div className="review-list">
              {reviewInfo
                .map((review, index) => (
                  <div className="review-item" key={index}>
                    <strong>You:</strong>
                    <div className="review-main">
                      {review.movieReviewContent}
                    </div>
                  </div>
                ))
                .reverse()}
              <div className="review-item">
                <strong>리뷰1:</strong> 하하
              </div>
              <div className="review-item">
                <strong>리뷰2:</strong> 리리리...
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
