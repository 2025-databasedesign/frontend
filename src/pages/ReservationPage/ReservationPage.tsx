import React, { useEffect } from "react";
import "./ReservationPage.css";
import Navbar from "../../components/Navbar";
import MovieSelection from "../../components/MovieSelection/MovieSelection";
import ScheduleSelectArea from "../../components/ScheduleSelectArea/ScheduleSelectArea";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
import DateSlider from "../../components/DateSlider/DateSlider";
import TheaterSelection from "../../components/TheaterSelection/TheaterSelection";

const ReservationPage: React.FC = () => {
  const selectedTheater = useScheduleRelatedStore(
    (state) => state.selectedTheater
  );
  // ------------------------- Access store
  const selectedDate = useScheduleRelatedStore((state) => state.selectedDate);
  const selectedMovie = useScheduleRelatedStore((state) => state.selectedMovie);
  const setSelectedMovie = useScheduleRelatedStore(
    (state) => state.setSelectedMovie
  );
  const shouldResetMovie = useScheduleRelatedStore(
    (state) => state.shouldResetMovie
  );
  const setShouldResetMovie = useScheduleRelatedStore(
    (state) => state.setShouldResetMovie
  );
  // ------------------------- Access store

  const weekday = new Date(selectedDate).toLocaleDateString("ko-KR", {
    weekday: "short",
  });

  useEffect(() => {
    setSelectedMovie(selectedMovie);

    if (shouldResetMovie) {
      setSelectedMovie(null);
      setShouldResetMovie(true); // keep default behavior for next time
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="reservation-page-main">
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <div className="reservation-main-area">
        <div className="reservation-main-container">
          <div className="left">
            <div className="selected-theater">{selectedTheater}</div>
            <TheaterSelection />
          </div>
          <div className="middle">
            <div className="selected-movie">{selectedMovie}</div>
            <MovieSelection />
          </div>
          <div className="right">
            <div className="selected-date">
              {selectedDate} ({weekday})
            </div>
            <div className="schedule-selection">
              <DateSlider />
              <div className="schedule-list-wrapper">
                <div className="schedule-list">
                  <ScheduleSelectArea />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
