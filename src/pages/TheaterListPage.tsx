import { useState } from "react";
import Navbar from "../components/Navbar";
import TheaterListHeader from "../components/TheaterList/TheaterListHeader";
import TheaterSeatMap from "../components/TheaterList/TheaterSeatMap";
import TheaterReview from "../components/TheaterList/TheaterReview";
import "./TheaterListPage.css";
import theaters from "../assets/theater_info/mock_seat.json";

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
          {theaters.map((theater) => {
            const isOpen = openTheaterId === theater.id;
            return (
              <div key={theater.id} className="theater-box">
                <div className="theater-header">
                  <h2>{theater.name}</h2>
                  <button
                    className="toggle-btn-icon"
                    onClick={() => toggleTheater(theater.id)}
                  >
                    {isOpen ? "−" : "+"}
                  </button>
                </div>

                {isOpen && (
                  <div style={{ display: "flex" }}>
                    <TheaterSeatMap
                      theaterNumber={theater.id}
                      layout={theater.layout}
                      isSelectable={false}
                    />
                    <TheaterReview Reviews={theater.Reviews} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
