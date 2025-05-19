import "./MovieListHeader.css";

type Props = {
  onSortChange: (sortType: string) => void;
  onFilterChange: (checked: boolean) => void;
  onlyNowPlaying: boolean;
};

export default function MovieListHeader({
  onSortChange,
  onFilterChange,
  onlyNowPlaying,
}: Props) {
  return (
    <div className="movie-list-header">
      <h1 className="header-title">무비차트</h1>

      <div className="controls-row">
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={onlyNowPlaying}
            onChange={(e) => onFilterChange(e.target.checked)}
          />
          <span>현재 상영작만 보기</span>
        </label>

        <div className="right-group">
          <select
            className="sort-select"
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option>예매율순</option>
            <option>별점순</option>
            <option>개봉일순</option>
          </select>
          {/* <button className="go-button">GO</button> */}
        </div>
      </div>
    </div>
  );
}
