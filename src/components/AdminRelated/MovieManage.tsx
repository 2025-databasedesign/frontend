import React, { useEffect, useState } from "react";
import "./MovieManage.css";
import { MovieInfo } from "../../types/AdminPageRelatedType";
// import { useCinemaRelatedStore } from "../../stores/CinemaRelatedStore";
import { PosterInfoProps } from "../../types/scheduleRelatedType";
import { getMovieInfo } from "../../utils/scheduleRelatedUtils";

const MovieManage: React.FC = () => {
  const [movieInfoForRegister, setMovieInfoForRegister] = useState<MovieInfo>({
    title: "",
    runningTime: "",
    releaseDate: "",
    director: "",
    actors: [""],
    grade: "",
    formats: [""],
    genreNames: [""],
  });
  const [movieListForDelete, setMovieListForDelete] = useState<
    PosterInfoProps[]
  >([]);
  // const movieList = useCinemaRelatedStore((state) => state.movieList)

  // -------------------------------movie register-------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMovieInfoForRegister((prev) => ({ ...prev, [name]: value }));
  };

  // 찐 handleMovieRegister API, 주소 확인
  const handleMovieRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://54.180.117.246/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movieInfoForRegister),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Register success:", data);
        alert("영화 등록 성공!");
      } else {
        const errorData = await response.json();
        console.error("Register failed:", errorData);
        alert(`영화 등록 실패: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("서버 오류로 영화 등록이 실패했습니다.");
    }
  };

  //Mock data

  // -------------------------------movie register-------------------------

  // -------------------------------movie delete-------------------------
  // mock data
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://54.180.117.246/api/movies", {
          headers: {
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const result = await response.json();
        // result.data는 배열, 각 객체에서 필요한 정보만 추출
        const movies: PosterInfoProps[] = result.data.map((movie: any) => ({
          movieId: movie.movieId || movie.movieid || movie.id || 0,
          movieName: movie.title,
          posterUrl: "", // 포스터 url이 없으므로 빈 값
        }));
        setMovieListForDelete(movies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  //찐 handleDeleteMovie API, 주소 확인
  const handleDeleteMovie = async (movieId: number) => {
    try {
      const response = await fetch(
        `http://54.180.117.246/api/movies/${movieId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Delete success:", data);
        alert("영화 삭제 성공!");
      } else {
        const errorData = await response.json();
        console.error("Delete failed:", errorData);
        alert(`영화 삭제 실패: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      alert("서버 오류로 영화 삭제 실패했습니다.");
    }
  };
  // -------------------------------movie delete-------------------------

  return (
    <div className="movie-main">
      <div className="movie-register">
        <div className="movie-manage-title">영화 등록</div>
        <form className="movie-register-form" onSubmit={handleMovieRegister}>
          <label>
            <span className="label">영화 제목</span>
            <input
              type="text"
              name="title"
              placeholder="영화 제목"
              value={movieInfoForRegister.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <span className="label">개봉일</span>
            <input
              type="date"
              name="releaseDate"
              value={movieInfoForRegister.releaseDate}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <span className="label">상영시간 (분)</span>
            <input
              type="text"
              name="runningTime"
              placeholder="180"
              value={movieInfoForRegister.runningTime}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <span className="label">영화 등급 (12, 15, 19, ALL)</span>
            <input
              type="text"
              name="grade"
              placeholder="ALL"
              value={movieInfoForRegister.grade}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <span className="label">장르 (쉼표로 구분)</span>
            <input
              type="text"
              name="genreNames"
              placeholder="액션, 코디미"
              value={movieInfoForRegister.genreNames.join(", ")}
              onChange={(e) =>
                setMovieInfoForRegister((prev) => ({
                  ...prev,
                  genreNames: e.target.value.split(",").map((s) => s.trim()),
                }))
              }
            />
          </label>
          <label>
            <span className="label">상영 포맷 (쉼표로 구분)</span>
            <input
              type="text"
              name="formats"
              placeholder="2D, 3D"
              value={movieInfoForRegister.formats.join(", ")}
              onChange={(e) =>
                setMovieInfoForRegister((prev) => ({
                  ...prev,
                  formats: e.target.value.split(",").map((s) => s.trim()),
                }))
              }
            />
          </label>
          <label>
            <span className="label">감독</span>
            <input
              type="text"
              name="director"
              placeholder="감독"
              value={movieInfoForRegister.director}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <span className="label">출연 배우 (쉼표로 구분)</span>
            <input
              type="text"
              name="actors"
              placeholder="홍길동, 가나다"
              value={movieInfoForRegister.actors.join(", ")}
              onChange={(e) =>
                setMovieInfoForRegister((prev) => ({
                  ...prev,
                  actors: e.target.value.split(",").map((s) => s.trim()),
                }))
              }
            />
          </label>
          <button type="submit" className="movie-register-button">
            영화 등록
          </button>
        </form>
      </div>
      <div className="movie-delete">
        <div className="movie-manage-title">영화 삭제</div>
        <div className="movie-delete-main-wrapper">
          <div className="movie-delete-main">
            {movieListForDelete.map((movie, index) => (
              <div className="movie-area-admin" key={movie.movieId}>
                {" "}
                {/* key에도 id */}
                <div
                  className="delete-icon"
                  onClick={() => handleDeleteMovie(movie.movieId)} // id를 전달
                >
                  <img
                    src="/src/assets/image/delete-icon.png"
                    alt="영화 삭제"
                    className="delete"
                  />
                </div>
                <div className="movie-title-admin">{movie.movieName}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <div className="movie-rank-manage">
        <div className="movie-manage-title">영화 순위 수정</div>
      </div> */}
    </div>
  );
};

export default MovieManage;
