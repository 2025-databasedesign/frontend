import React, { useEffect } from "react";
import { useState } from "react";
import "./MovieSelection.css";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
// import { useCinemaRelatedStore } from "../../stores/CinemaRelatedStore";
import { getMovieInfo } from "../../utils/scheduleRelatedUtils";
import { fullScheduleProps } from "../../types/scheduleRelatedType";
import checkIcon from "../../assets/image/check.png";

const parseGradeNumber = (gradePath: string) => {
  const match = gradePath.match(/grade_(\d+)\.png$/);
  return match ? match[1] : "등급 정보 없음";
};

const MovieSelection: React.FC = () => {
  const [movies, setMovies] = useState<fullScheduleProps[]>([]);
  // ------------------------- Access store
  const selectedMovie = useScheduleRelatedStore((state) => state.selectedMovie);
  const setSelectedTheater = useScheduleRelatedStore(
    (state) => state.setSelectedTheater
  );
  const setSelectedMovie = useScheduleRelatedStore(
    (state) => state.setSelectedMovie
  );
  // ------------------------- Access store

  // const {movieList, setMovieList} = useCinemaRelatedStore();

  //mock movies' data
  // useEffect(() => {
  //   setSelectedMovie(null);

  //   const fetchMovies = async () => {
  //     const data = await getMovieInfo();
  //     if (data) {
  //       setMovies(data);
  //     }
  //   };
  //   fetchMovies();

  //   setSelectedTheater(null);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // 찐 api
  useEffect(() => {
    setSelectedMovie(null);

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
          }));
          setMovies(mapped);
        }
      })
      .catch((err) => {
        console.log("Error fetching movies: ", err);
      });

    setSelectedTheater(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="movie-selection">
      <ul>
        {/* mock data */}
        {movies.map((movie, id) => (
          <li key={id}>
            <a
              href="#none"
              onClick={() => setSelectedMovie(movie.movieName)}
              className={selectedMovie === movie.movieName ? "selected" : ""}
            >
              <div className="grade-title-area">
                <img
                  src={movie.grade}
                  alt={`${parseGradeNumber(movie.grade)}`}
                />
                {movie.movieName}
              </div>
              <img
                src={checkIcon}
                className={`check ${
                  selectedMovie === movie.movieName ? "selected" : ""
                }`}
                alt={movie.movieName}
              />
            </a>
          </li>
        ))}

        {/* real API */}
        {/* {movieList.map((movie, id) => (
          <li key={id}>
            <a
              href="#none"
              onClick={() => setSelectedMovie(movie.title)}
              className={selectedMovie === movie.title ? "selected" : ""}
            >
              <div className="grade-title-area">
                <img
                  src={`/src/assets/grade_${extractGradeValue(
                    movie.grade
                  )}.png`}
                  alt={`${movie.grade}`}
                />
                {movie.title}
              </div>
              <img
                src={checkIcon}
                className={`check ${
                  selectedMovie === movie.title ? "selected" : ""
                }`}
                alt={movie.title}
              />
            </a>
          </li>
        ))} */}
      </ul>
    </div>
  );
};

export default MovieSelection;
