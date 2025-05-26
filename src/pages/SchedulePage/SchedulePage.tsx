import React from "react";
import "./SchedulePage.css";
import Navbar from "../../components/Navbar";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
import ScheduleSelector from "../../components/ScheduleSelector/ScheduleSelector";

const SchedulePage: React.FC = () => {
  const { scheduleViewType, setScheduleViewType } = useScheduleRelatedStore();
  return (
    <div className="schedule-page-main">
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <div className="schedule-main-area">
        <div className="content">
          <div className="hall-and-movie-wrapper">
            <button
              className={`"hall-schedule-btn" ${
                scheduleViewType == "theater" ? "selected-btn" : ""
              }`}
              onClick={() => setScheduleViewType("theater")}
            >
              상영관별 상영시간표
            </button>
            <button
              className={`"movie-schedule-btn" ${
                scheduleViewType == "movie" ? "selected-btn" : ""
              }`}
              onClick={() => setScheduleViewType("movie")}
            >
              영화별 상영시간표
            </button>
          </div>
          <ScheduleSelector />
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
