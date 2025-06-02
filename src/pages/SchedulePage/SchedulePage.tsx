import React from "react";
import "./SchedulePage.css";
import Navbar from "../../components/Navbar";
import ScheduleSelector from "../../components/ScheduleSelector/ScheduleSelector";
import { useCinemaRelatedStore } from "../../stores/CinemaRelatedStore";

const SchedulePage: React.FC = () => {
  // ------------------------- Access store
  const scheduleViewType = useCinemaRelatedStore(
    (state) => state.scheduleViewType
  );
  const setScheduleViewType = useCinemaRelatedStore(
    (state) => state.setScheduleViewType
  );
  // ------------------------- Access store

  return (
    <div className="schedule-page-main">
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <div className="schedule-main-area">
        <div className="content">
          <div className="hall-and-movie-wrapper">
            <button
              className={`"movie-schedule-btn" ${
                scheduleViewType == "movie" ? "selected-btn" : ""
              }`}
              onClick={() => setScheduleViewType("movie")}
            >
              영화별 상영시간표
            </button>
            <button
              className={`"hall-schedule-btn" ${
                scheduleViewType == "theater" ? "selected-btn" : ""
              }`}
              onClick={() => setScheduleViewType("theater")}
            >
              상영관별 상영시간표
            </button>
          </div>
          <ScheduleSelector />
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
