import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./MovieDetailPage.css";
import { useScheduleRelatedStore } from "../stores/ScheduleRelatedStore";
import { AppRoutes } from "../routes/AppRoutes";
// import { useReviewStore } from "../stores/ReviewStore";
import { useReservationHistoryStore } from "../stores/ReservationHistoryStore";
import { useUserStore } from "../stores/UserRelatedStore";

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
  const [selectedStar, setSelectedStar] = useState<number | null>(null);

  const navigate = useNavigate();
  // ------------------------- Access store
  // const selectedMovie = useScheduleRelatedStore((state) => state.selectedMovie);
  const setSelectedMovie = useScheduleRelatedStore(
    (state) => state.setSelectedMovie
  );
  const setShouldResetMovie = useScheduleRelatedStore(
    (state) => state.setShouldResetMovie
  );
  const reservationHistory = useReservationHistoryStore(
    (state) => state.reservationHistory
  );
  const [movieReviewList, setMovieReviewList] = useState<any[]>([]);
  // const addMovieReview = useReviewStore((state) => state.addMovieReview);

  // Get user info from store at the top level (not inside the function)
  const userName = useUserStore((state) => state.name);
  const userEmail = useUserStore((state) => state.userEmail);

  // ------------------------- Access store

  const textarea = document.getElementById(
    "textAreaReview"
  ) as HTMLTextAreaElement;
  const charCount = document.getElementById("charCount") as HTMLDivElement;
  const maxLength = 100;
  const filteredHistory = reservationHistory.filter(
    (m) => m.movie == movie?.movieName
  );

  const myReviews = movieReviewList.filter(
    (r) => r.reviewer === userName || r.reviewer === userEmail
  );
  const reviewable =
    filteredHistory.length > 0 && myReviews.length < filteredHistory.length;

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

  async function handleReview() {
    if (!movie || !textarea || !textarea.value.trim()) return;

    const reviewPayload = {
      content: textarea.value,
      rating: selectedStar, // 별점 입력 UI가 없으니 임시로 1
      targetType: "MOVIE",
      targetId: movie.movieId,
      reviewer: userName || userEmail, // 사용자 정보가 있다면 교체
    };

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("http://54.180.117.246/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(reviewPayload),
      });
      const result = await res.json();
      if (result?.result) {
        // 새 리뷰 목록에 추가
        setMovieReviewList((prev) => [
          ...prev,
          {
            movieReviewId: result.data?.id ?? Date.now(),
            movieStar: result.data?.rating ?? 1,
            movieName: movie.movieName,
            movieReviewTime: result.data?.createdAt ?? new Date().toISOString(),
            movieReviewContent: result.data?.content ?? textarea.value,
            reviewer: result.data?.reviewer ?? "익명",
          },
        ]);
        textarea.value = "";
        charCount.textContent = `0 / 100`;
        setTextCount(0);
      } else {
        alert("리뷰 등록에 실패했습니다.");
      }
    } catch (e) {
      alert("리뷰 등록 중 오류가 발생했습니다.");
    }
  }

  useEffect(() => {
    if (!movieId) return;

    console.log("Fetching movie details for:", movieId);

    // Fetch movies and reviews in parallel
    fetch("http://54.180.117.246/api/movies")
      .then((res) => res.json())
      .then(async (moviesResult) => {
        if (moviesResult?.result && Array.isArray(moviesResult.data)) {
          // moviesResult.data.map(async ...)은 Promise 배열이 되므로 Promise.all 필요
          // 영화별 매출 데이터 fetch
          const revenueRes = await fetch(
            "http://54.180.117.246/api/revenue/movie"
          );
          const revenueJson = await revenueRes.json();
          const revenueData = revenueJson?.data ?? {};

          const mapped = await Promise.all(
            moviesResult.data.map(async (item: any) => {
              let star: number | null = null;
              let rating: number = 0;
              try {
                // 리뷰 정보 fetch
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
                // ignore fetch error, keep star/rating as default
              }

              // 예매수 = 매출 / 15000 (올림)
              const movieRevenue = revenueData[item.title];
              if (typeof movieRevenue === "number") {
                rating = Math.ceil(movieRevenue / 15000);
              }

              return {
                movieId: item.movieId,
                movieName: item.title,
                rating,
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

          const matched = mapped.find((m) => m.movieName === movieId);
          setMovie(matched ?? null);

          if (matched) {
            // 영화가 있으면 해당 영화의 리뷰를 fetch
            const reviewsRes = await fetch(
              `http://54.180.117.246/api/reviews?type=MOVIE&targetId=${matched.movieId}`
            );
            const reviewsResult = await reviewsRes.json();
            if (reviewsResult?.result && Array.isArray(reviewsResult.data)) {
              // reviewer가 userId이므로, 각 리뷰의 reviewer(userId) -> email로 변환
              const token = localStorage.getItem("access_token");
              const reviewList = await Promise.all(
                reviewsResult.data.map(async (item: any) => {
                  let reviewerEmail = item.reviewer;
                  try {
                    const userRes = await fetch(
                      `http://54.180.117.246/api/users/id/${item.reviewer}`,
                      {
                        headers: {
                          ...(token
                            ? { Authorization: `Bearer ${token}` }
                            : {}),
                        },
                      }
                    );
                    if (userRes.ok) {
                      const userJson = await userRes.json();
                      if (userJson?.result && userJson.data) {
                        reviewerEmail = userJson.data;
                      }
                    }
                  } catch (e) {
                    // 실패 시 reviewer는 그대로 userId
                  }
                  return {
                    movieReviewId: item.id,
                    movieStar: item.rating,
                    movieName: matched.movieName,
                    movieReviewTime: item.createdAt,
                    movieReviewContent: item.content,
                    reviewer: reviewerEmail,
                  };
                })
              );
              setMovieReviewList(reviewList);
            }
          } else {
            setMovieReviewList([]);
          }
        }
      });
  }, [movieId]);

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
              예매수 {movie.rating} | ⭐ {movie.star ?? "평점 없음"}
            </div>
            <div className="movie-details">
              감독: {movie.director ?? "정보 없음"} / 배우:{" "}
              {movie.actors && movie.actors.length > 0
                ? movie.actors.join(", ")
                : "정보 없음"}
              <br />
              장르:{" "}
              {movie.genreNames && movie.genreNames.length > 0
                ? movie.genreNames.join(", ")
                : "정보 없음"}{" "}
              / 개봉: {movie.releaseDate ?? "정보 없음"}
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
              <div className="star-rating" style={{ marginBottom: 8 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      cursor: "pointer",
                      color: star <= (selectedStar ?? 0) ? "#FFD700" : "#ccc",
                      fontSize: "1.5em",
                    }}
                    onClick={() => setSelectedStar(star)}
                    data-testid={`star-${star}`}
                  >
                    ★
                  </span>
                ))}
              </div>
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
          {movieReviewList.length > 0 ? (
            <div className="review-list">
              {movieReviewList
                .slice() // copy to avoid mutating original
                .reverse()
                .map((review, index) => (
                  <div
                    className="review-item"
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <div
                      style={{
                        minWidth: 80,
                        fontWeight: "bold",
                        marginRight: 16,
                      }}
                    >
                      {review.reviewer ?? "작성자 없음"}
                    </div>
                    <div style={{ flex: 1 }}>{review.movieReviewContent}</div>
                    <div
                      style={{
                        minWidth: 120,
                        textAlign: "right",
                        marginLeft: 16,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        className="review-star"
                        style={{ color: "#FFD700", marginRight: 8 }}
                      >
                        {"⭐".repeat(review.movieStar ?? 0)}
                        {review.movieStar ? ` (${review.movieStar})` : ""}
                      </span>
                      <span
                        className="review-time"
                        style={{ color: "#888", fontSize: "0.95em" }}
                      >
                        {review.movieReviewTime
                          ? new Date(review.movieReviewTime).toLocaleString()
                          : ""}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="review-list">
              <div className="review-item">아직 등록된 리뷰가 없습니다.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
