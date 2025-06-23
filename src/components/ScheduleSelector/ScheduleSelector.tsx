import React from "react";
import "./ScheduleSelector.css";
import ScheduleSelectArea from "../ScheduleSelectArea/ScheduleSelectArea";
import { useScheduleRelatedStore } from "../../stores/ScheduleRelatedStore";
import MovieSelection from "../MovieSelection/MovieSelection";
import DateSlider from "../DateSlider/DateSlider";
import TheaterSelection from "../TheaterSelection/TheaterSelection";
import { useCinemaRelatedStore } from "../../stores/CinemaRelatedStore";

const ScheduleSelector: React.FC = () => {
  const today = new Date();
  const formatted = today.toISOString().split("T")[0]; // "2025-05-14"
  //const dayName = today.toLocaleDateString("ko-KR", { weekday: "short" }); //"월", "화"

  // ------------------------- Access store
  const selectedTheater = useScheduleRelatedStore(
    (state) => state.selectedTheater
  );
  const selectedMovie = useScheduleRelatedStore((state) => state.selectedMovie);
  const selectedDate = useScheduleRelatedStore((state) => state.selectedDate);
  const scheduleViewType = useCinemaRelatedStore(
    (state) => state.scheduleViewType
  );
  // ------------------------- Access store

  const weekday = new Date(selectedDate).toLocaleDateString("ko-KR", {
    weekday: "short",
  });

  return (
    <div className="theater-main-container">
      <div className="left-area">
        {scheduleViewType == "theater" ? selectedTheater : selectedMovie}
      </div>
      <div className="right-area">
        {selectedDate ? selectedDate : formatted}({weekday})
      </div>
      <div className="left-section">
        {scheduleViewType == "theater" ? (
          <TheaterSelection />
        ) : (
          <MovieSelection />
        )}
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
  );
};

export default ScheduleSelector;
