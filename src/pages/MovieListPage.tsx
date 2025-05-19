import { useState } from "react";
import Navbar from "../components/Navbar";
import MovieListHeader from "../components/MovieList/MovieListHeader";
import MovieCardGrid from "../components/MovieList/MovieCardGrid";
import "./MovieListPage.css";

export default function MovieListPage() {
  const [sortType, setSortType] = useState("예매율순");
  const [onlyNowPlaying, setOnlyNowPlaying] = useState(false); // ✅ 추가

  return (
    <div>
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <div className="movie-list-page__container">
        <MovieListHeader
          onSortChange={setSortType}
          onFilterChange={setOnlyNowPlaying} // ✅ 필터 핸들러 전달
          onlyNowPlaying={onlyNowPlaying}
        />
        <MovieCardGrid sortType={sortType} onlyNowPlaying={onlyNowPlaying} />
      </div>
    </div>
  );
}
