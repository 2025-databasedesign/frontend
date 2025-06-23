import { useState } from "react";
import Navbar from "../components/Navbar";
import TheaterListHeader from "../components/TheaterList/TheaterListHeader";
import TheaterSeatMap from "../components/TheaterList/TheaterSeatMap";
import TheaterReview from "../components/TheaterList/TheaterReview";
import "./TheaterListPage.css";
// import theaters from "../assets/theater_info/mock_seat.json";

export default function TheaterListPage() {
  const [openTheaterId, setOpenTheaterId] = useState<number | null>(null);

  const toggleTheater = (id: number) => {
    setOpenTheaterId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <div className="movie-list-page__container">
        <TheaterListHeader />

        <div className="all-theaters-box">
          {/* theatersData fetch */}
          {(() => {
            const [theatersData, setTheatersData] = useState<any[]>([]);
            const [loading, setLoading] = useState(true);

            useState(() => {
              fetch("http://54.180.117.246/api/theaters")
                .then((res) => res.json())
                .then((data) => {
                  setTheatersData(data.data || []);
                  setLoading(false);
                });
            }, []);

            if (loading) return <div>Loading...</div>;

            return theatersData.map((theater) => {
              const isOpen = openTheaterId === theater.theaterId;

                // Find max row and col (row/colNo are 0-based, but may have gaps)
                const maxRow = Math.max(...theater.seats.map((s) => s.rowNo)) + 1;
                const maxCol = Math.max(...theater.seats.map((s) => s.colNo)) + 1;

                // Build 2D layout array, filling missing seats with 0
                const layout: number[][] = Array.from({ length: maxRow }, (_, rowIdx) =>
                Array.from({ length: maxCol }, (_, colIdx) => {
                  const seat = theater.seats.find(
                  (s) => s.rowNo === rowIdx && s.colNo === colIdx
                  );
                  return seat ? 1 : 0;
                })
                );

              return (
          <div key={theater.theaterId} className="theater-box">
            <div
              className="theater-header"
              onClick={() => toggleTheater(theater.theaterId)}
            >
              <h2>{theater.theaterName}</h2>
              <button className="toggle-btn-icon">
                {isOpen ? "−" : "+"}
              </button>
            </div>

            {isOpen && (
              <div style={{ display: "flex" }}>
                <TheaterSeatMap
            theaterNumber={theater.theaterId}
            layout={layout}
            isSelectable={false}
                />
                {/* 리뷰 데이터가 없으므로 빈 배열 전달 */}
                <TheaterReview Reviews={[]} />
              </div>
            )}
          </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}
