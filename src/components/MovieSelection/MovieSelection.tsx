import React, { useEffect, useState } from "react";
import "./MovieSelection.css";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
import { getMovieInfo } from "../../utils/scheduleRelatedUtils";
import { fullScheduleProps } from "../../types/ScheduleRelatedType";

const MovieSelection: React.FC = () => {
  const [movies, setMovies] = useState<fullScheduleProps[]>([]);
  const { selectedMovie, setSelectedMovie, setSelectedTheater } =
    useScheduleRelatedStore();

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getMovieInfo();
      if (data) {
        setMovies(data);
      }
    };
    fetchMovies();
    setSelectedTheater(null);
  }, [setSelectedTheater]);

  return (
    <div className="movie-selection">
      <ul>
        {movies.map((movie, id) => (
          <li key={id}>
            <a
              href="#none"
              onClick={() => setSelectedMovie(movie.movieName)}
              className={selectedMovie === movie.movieName ? "selected" : ""}
            >
              <img src={movie.grade} />
              {movie.movieName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieSelection;
