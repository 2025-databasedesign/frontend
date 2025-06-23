import React from "react";
import "./MyReview.css";
import { useReviewStore } from "../../stores/ReviewStore";
import { useNavigate } from "react-router-dom";

const MyReview: React.FC = () => {
  const navigate = useNavigate();
  // ------------------------- Access store
  const movieReviewList = useReviewStore((state) => state.movieReviewList);
  const deleteMovieReview = useReviewStore((state) => state.deleteMovieReview);
  // ------------------------- Access store

  function handleNavigateReview(movie: string) {
    const encodedName = encodeURIComponent(movie); // URL에 안전하게 포함되도록 인코딩
    navigate(`/movies/${encodedName}`);
  }

  return (
    <div className="my-review-main">
      {movieReviewList.length == 0 ? (
        <p className="no-review">등록된 리뷰가 없습니다.</p>
      ) : (
        <div className="my-reivew-wrapper">
          <div className="total">
            총 <span>{movieReviewList.length}</span> 건
          </div>
          <div className="my-reivew-main-wrapper">
            {movieReviewList.map((review, index) => {
              const [posterPath, setPosterPath] = React.useState<string>("");

              React.useEffect(() => {
                if (review.movieName) {
                  fetch(
                    `http://54.180.117.246/api/movies/posterPath?title=${encodeURIComponent(
                      review.movieName
                    )}`
                  )
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.result && data.data) {
                        setPosterPath(
                          data.data
                            ? `http://54.180.117.246${data.data.replace(
                                /^\/images\/posters\//,
                                "/Images/"
                              )}`
                            : "/src/assets/movie1.jpg"
                        );
                        console.log("Poster Path:", data);
                      }
                    })
                    .catch(() => setPosterPath("/src/assets/movie1.jpg"));
                }
              }, [review.movieName]);

              return (
                <div className="my-review-main" key={index}>
                  <div className="top">
                    <div className="top-left">
                      <img
                        src={posterPath}
                        alt="영화포스터"
                        className="poster"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/src/assets/movie1.jpg";
                        }}
                      />
                    </div>
                    <div className="top-right">
                      <div className="movie-title">{review.movieName}</div>
                      <div className="review-score">{review.movieStar}</div>
                      <div className="review-content">
                        {review.movieReviewContent}
                      </div>
                      <div className="review-time">
                        {review.movieReviewTime}
                      </div>
                    </div>
                  </div>
                  <div className="bottom">
                    <button
                      className="bottom-left"
                      onClick={() => handleNavigateReview(review.movieName)}
                    >
                      관람평보기
                    </button>
                    <button
                      className="bottom-right-delete"
                      onClick={() => deleteMovieReview(review.movieReviewId)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReview;
