import React, { useEffect } from "react";
import { useState } from "react";
import "./MovieSelection.css";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
import { getMovieInfo } from "../../utils/scheduleRelatedUtils";
import { fullScheduleProps } from "../../types/ScheduleRelatedType";
// import Grade from "../Grade/Grade";
import checkIcon from "../../assets/image/check.png";

const parseGradeNumber = (gradePath: string) => {
  const match = gradePath.match(/grade_(\d+)\.png$/);
  return match ? match[1] : "등급 정보 없음";
};

const MovieSelection: React.FC = () => {
  const [movies, setMovies] = useState<fullScheduleProps[]>([]);
  const {
    selectedMovie,
    // movieList,
    setSelectedMovie,
    setSelectedTheater,
    setMovieList,
  } = useScheduleRelatedStore();

  //mock movies' data
  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getMovieInfo();
      if (data) {
        setMovies(data);
      }
    };
    fetchMovies();
    setSelectedTheater(null);
  }, [setMovieList, setSelectedTheater]);

  //찐 api
  // useEffect(() => {
  //   fetch("http://54.180.117.246/api/movies")
  //     .then((res) => res.json())
  //     .then((resData) => {
  //       console.log("Fetched data:", resData);
  //       setMovieList(resData.data);
  //     })
  //     .catch((err) => console.error("Fetch error:", err));
  //   setSelectedTheater(null);
  // }, [setMovieList, setSelectedTheater]);

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
              {/* <Grade grade={`${parseGradeNumber(movie.grade)}`}/> */}
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
              // <img src={movie.grade} alt={`${parseGradeNumber(movie.grade)}`} />
              {movie.title}
            </a>
          </li>
        ))} */}
      </ul>
    </div>
  );
};

export default MovieSelection;
